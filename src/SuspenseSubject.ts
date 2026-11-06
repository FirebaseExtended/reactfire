import { EMPTY, from, Observable, of, ReplaySubject, Subject, Subscriber, Subscription, timer } from 'rxjs';
import { catchError, delay, mergeMap, share, tap } from 'rxjs/operators';
import { ObservableStatus } from './useObservable.js';

// Grace period before a zero-subscriber stream detaches its Firebase listener and evicts its cache entry.
// A 1-second window lets React StrictMode double-mounts and immediate route transitions reuse the active listener.
const LISTENER_RELEASE_DELAY_MS = 1000;

// How long a first-load error stays cached in non-suspense mode, so the render that hit it can throw it to a boundary.
const FIRST_LOAD_ERROR_EVICT_DELAY_MS = 1000;

export class SuspenseSubject<T> extends Subject<T> {
  private _value: T | undefined;
  private _hasValue = false;
  private _warmupRelease: Subscription;
  private _firstEmission: Promise<void>;
  private _error: any = undefined;
  private _innerObservable: Observable<T>;
  private _warmupSubscription: Subscription;
  private _immutableStatus: ObservableStatus<T>;
  private _isComplete = false;
  private _subscriberCount = 0;

  private _resolveFirstEmission!: () => void;

  constructor(
    innerObservable: Observable<T>,
    private _timeoutWindow: number,
    private _suspenseEnabled: boolean,
    private _onEvict: () => void,
    private _onReregister: () => void
  ) {
    super();
    this._firstEmission = new Promise<void>((resolve) => (this._resolveFirstEmission = resolve));

    this._immutableStatus = {
      status: 'loading',
      hasEmitted: false,
      isComplete: false,
      data: undefined,
      error: undefined,
      firstValuePromise: this._firstEmission
    } as ObservableStatus<T>;

    // `from` re-wraps an Observable from another rxjs copy (rxjs 6 apps) so unsubscribe reaches the source.
    this._innerObservable = from(innerObservable).pipe(
      tap({
        next: (value) => {
          this._next(value);
        },
        error: (error) => {
          // save the error, so that we can raise on subscription or .value
          // resolve the promise, so suspense tries again
          this._error = error;
          this._resolveFirstEmission();
          this._updateImmutableStatus();
          // #485: nobody is left to read the error, so evict now.
          // #742: non-suspense evicts after a delay so the next mount retries; Suspense keeps it, since React may retry a suspended render after any delay.
          if (this._subscriberCount === 0 && this._warmupSubscription?.closed) {
            this._onEvict();
          } else if (!this._suspenseEnabled) {
            // Re-check when the timer fires: a Suspense hook may read this entry after the error arrives.
            setTimeout(() => {
              if (!this._suspenseEnabled) {
                this._onEvict();
              }
            }, FIRST_LOAD_ERROR_EVICT_DELAY_MS);
          }
        },
        complete: () => {
          this._isComplete = true;
          this._updateImmutableStatus();
        }
      }),
      catchError(() => EMPTY),
      // `resetOnComplete: false` keeps a completed one-shot (`*Once`) value cached; resetting would make a mounted component re-fetch.
      share({
        connector: () => new ReplaySubject<T>(1),
        resetOnComplete: false,
        resetOnRefCountZero: () =>
          timer(LISTENER_RELEASE_DELAY_MS).pipe(
            // A suspended render holds no subscription, so never tear down before the first emission settles,
            // then give that render one more grace period to subscribe.
            mergeMap(() => (this._hasValue || this._error ? of(undefined) : from(this._firstEmission).pipe(delay(LISTENER_RELEASE_DELAY_MS)))),
            tap(this._onEvict)
          ),
      })
    );
    // warm up the observable
    this._warmupSubscription = this._innerObservable.subscribe();

    // Release the warm-up `_timeoutWindow` after the first emission, giving a suspended component time to subscribe (#525).
    // A stream that completed during warm-up skips `resetOnRefCountZero`, so evict it here (#790).
    this._warmupRelease = from(this._firstEmission)
      .pipe(delay(this._timeoutWindow))
      .subscribe(() => {
        this._warmupSubscription.unsubscribe();
        if (this._isComplete) {
          this._onEvict();
        }
      });
  }

  // An entry created with Suspense off (by a preload helper, which cannot read the Suspense context)
  // switches to the Suspense error policy once a Suspense hook reads it. It never switches back.
  enableSuspense() {
    this._suspenseEnabled = true;
  }

  get hasValue(): boolean {
    // hasValue returns true if there's an error too
    // so that after we resolve the promise & useObservable is called again
    // we won't throw again
    return this._hasValue || !!this._error;
  }

  get value(): T {
    if (this._error) {
      throw this._error;
    } else if (!this.hasValue) {
      throw Error('Can only get value if SuspenseSubject has a value');
    }
    return this._value as T;
  }

  get firstEmission(): Promise<void> {
    return this._firstEmission;
  }

  private _updateImmutableStatus() {
    // `data` is `T | undefined` until the first value; ObservableStatus exposes `T`.
    this._immutableStatus = {
      status: this._error ? 'error' : (this._hasValue ? 'success' : 'loading'),
      hasEmitted: this._hasValue,
      isComplete: this._isComplete,
      data: this._value,
      error: this._error,
      firstValuePromise: this._firstEmission
    } as ObservableStatus<T>;
  }

  private _next(value: T) {
    this._hasValue = true;
    this._value = value;
    this._resolveFirstEmission();
    this._updateImmutableStatus();
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    // A mounted subscriber owns the source now; the warm-up release would evict a mounted one-shot entry.
    this._warmupRelease.unsubscribe();
    if (!this._error && !this._isComplete) {
      this._onReregister();
    }
    this._subscriberCount++;
    const innerSubscription = this._innerObservable.subscribe({
      next: (value) => subscriber.next(value),
      error: (error) => subscriber.error(error),
      complete: () => {
        if (this._error) {
          // `catchError(() => EMPTY)` converts upstream errors into completions.
          // Notify `useObservable` (`onStoreChange`) without calling `subscriber.complete()`,
          // because `subscriber.complete()` auto-unsubscribes `subscriber` before React unmounts.
          subscriber.next(this._value);
        } else {
          subscriber.complete();
        }
      },
    });
    // Hand off ownership of the shared source from the warm-up subscription to the real subscriber.
    this._warmupSubscription.unsubscribe();
    return new Subscription(() => {
      innerSubscription.unsubscribe();
      this._subscriberCount--;
      if (this._subscriberCount === 0 && this._error) {
        this._onEvict();
      }
    });
  }

  get ourError() {
    return this._error;
  }

  get immutableStatus() {
    return this._immutableStatus;
  }
}
