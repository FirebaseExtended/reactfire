import { EMPTY, Observable, ReplaySubject, Subject, Subscriber, Subscription, timer } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { ObservableStatus } from './useObservable.js';

// Grace period before a zero-subscriber stream detaches its Firebase listener and evicts its cache entry.
// A 1-second window lets React StrictMode double-mounts and immediate route transitions reuse the active listener.
const RELEASE_DELAY_MS = 1000;

export class SuspenseSubject<T> extends Subject<T> {
  private _value: T | undefined;
  private _hasValue = false;
  private _timeoutHandler: ReturnType<typeof setTimeout>;
  private _firstEmission: Promise<void>;
  private _error: any = undefined;
  private _innerObservable: Observable<T>;
  private _warmupSubscription: Subscription;
  private _immutableStatus: ObservableStatus<T>;
  private _isComplete = false;
  private _subscriberCount = 0;

  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _innerSubscriber: Subscription;
  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _resolveFirstEmission: () => void;

  constructor(
    innerObservable: Observable<T>,
    private _timeoutWindow: number,
    _suspenseEnabled: boolean,
    private _onEvict: () => void = () => {}
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

    this._innerObservable = innerObservable.pipe(
      tap({
        next: (v) => {
          this._next(v);
        },
        error: (e) => {
          // save the error, so that we can raise on subscription or .value
          // resolve the promise, so suspense tries again
          this._error = e;
          this._resolveFirstEmission();
          this._updateImmutableStatus();
          // If all subscribers have already unmounted (such as a listener rejected after sign-out during the release grace window),
          // evict immediately so a fast re-sign-in never reads the stale error (#485).
          // Otherwise, keep the entry for `RELEASE_DELAY_MS` so a suspended or active render can read and throw it (#742).
          // `catchError(() => EMPTY)` below converts errors into completions before `share` sees them, so `tap.error` and unmount handle eviction.
          if (this._subscriberCount === 0 && this._warmupSubscription?.closed) {
            this._onEvict();
          } else {
            setTimeout(this._onEvict, RELEASE_DELAY_MS);
          }
        },
        complete: () => {
          this._isComplete = true;
          this._updateImmutableStatus();
        }
      }),
      catchError(() => EMPTY),
      // Multicast one Firebase listener across all subscribers:
      // - `connector`: replay the latest emission to new subscribers on mount.
      // - `resetOnError`: tear down the source subscription on error (upstream `catchError` converts errors to completions first).
      // - `resetOnComplete`: keep the final value cached when a one-shot stream (`first()` in `*Once` hooks) completes,
      //   because RxJS auto-closes the subscriber on completion while the component remains mounted; evicting on completion
      //   would cause mounted `*Once` components to re-fetch on subsequent renders.
      // - `resetOnRefCountZero`: detach the Firebase listener and evict the cache entry after `RELEASE_DELAY_MS` with zero subscribers.
      share({
        connector: () => new ReplaySubject<T>(1),
        resetOnError: true,
        resetOnComplete: false,
        resetOnRefCountZero: () => timer(RELEASE_DELAY_MS).pipe(tap(this._onEvict)),
      })
    );
    // warm up the observable
    this._warmupSubscription = this._innerObservable.subscribe();

    // Release the warm-up subscription if no component subscribes within `_timeoutWindow` after the first emission settles.
    // Wait until the first emission settles so a suspended component can resolve `firstEmission`, re-render, and call `_subscribe` (#525).
    // If the stream already completed during warm-up (`first()`), `share` skips `resetOnRefCountZero`, so call `_onEvict` directly (#790).
    const releaseWarmupWhenSettled = () => {
      if (this._hasValue || this._error) {
        this._warmupSubscription.unsubscribe();
        if (this._isComplete) {
          this._onEvict();
        }
      } else {
        this._timeoutHandler = setTimeout(releaseWarmupWhenSettled, this._timeoutWindow);
      }
    };
    this._timeoutHandler = setTimeout(releaseWarmupWhenSettled, this._timeoutWindow);
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
    // Cast required because `data` is internally `T | undefined` while a value is
    // still in flight, whereas ObservableStatus exposes `data: T` to consumers.
    // The relationships between the status fields are verified in tests instead.
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
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
    }
    this._subscriberCount++;
    this._innerSubscriber = this._innerObservable.subscribe({
      next: (v) => subscriber.next(v),
      error: (e) => subscriber.error(e),
      complete: () => {
        // Notify `useObservable` (`onStoreChange`) without calling `subscriber.complete()`,
        // because `subscriber.complete()` auto-unsubscribes `subscriber` before React unmounts.
        subscriber.next(this._value as T);
      },
    });
    // Hand off ownership of the shared source from the warm-up subscription to the real subscriber.
    this._warmupSubscription.unsubscribe();
    return new Subscription(() => {
      this._innerSubscriber.unsubscribe();
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
