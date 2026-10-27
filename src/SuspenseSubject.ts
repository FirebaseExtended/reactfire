import { empty, Observable, ReplaySubject, Subject, Subscriber, Subscription, timer } from 'rxjs';
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

  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _innerSubscriber: Subscription;
  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _resolveFirstEmission: () => void;

  constructor(
    innerObservable: Observable<T>,
    private _timeoutWindow: number,
    _suspenseEnabled: boolean,
    onEvict: () => void = () => {}
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
          // Evict the errored entry after the current render reads it so a remount or ErrorBoundary retry starts fresh (#742, #485).
          setTimeout(onEvict, RELEASE_DELAY_MS);
        },
        complete: () => {
          this._isComplete = true;
          this._updateImmutableStatus();
        }
      }),
      catchError(() => empty()),
      // Multicast one underlying Firebase listener across all subscribers:
      // - `connector`: cache and replay the most recent emission to new subscribers on mount.
      // - `resetOnError`: tear down the source subscription when the stream errors.
      // - `resetOnComplete`: keep the final value cached when a one-shot stream (`first()`) completes.
      // - `resetOnRefCountZero`: unsubscribe from Firebase and evict the cache entry once no subscribers remain for `RELEASE_DELAY_MS`.
      share({
        connector: () => new ReplaySubject<T>(1),
        resetOnError: true,
        resetOnComplete: false,
        resetOnRefCountZero: () => timer(RELEASE_DELAY_MS).pipe(tap(onEvict)),
      })
    );
    // warm up the observable
    this._warmupSubscription = this._innerObservable.subscribe();

    // Release the warm-up subscription if no component subscribes within `_timeoutWindow` after the first emission settles.
    // Do not release while the first emission is still pending: a suspended component is waiting on `firstEmission`, and
    // React will not retry the render and call `_subscribe` until that promise resolves (#525).
    const releaseWarmupWhenSettled = () => {
      if (this._hasValue || this._error) {
        this._warmupSubscription.unsubscribe();
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
    // TODO figure out how to reset the cache here, if I _reset() here before throwing
    // it doesn't seem to work.
    // As it is now, this will burn the cache entry until the timeout fires.
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
    this._innerSubscriber = this._innerObservable.subscribe(subscriber);
    // Hand off ownership of the shared source from the warm-up subscription to the real subscriber.
    this._warmupSubscription.unsubscribe();
    return this._innerSubscriber;
  }

  get ourError() {
    return this._error;
  }

  get immutableStatus() {
    return this._immutableStatus;
  }
}
