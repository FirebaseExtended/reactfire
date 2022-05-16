import { empty, Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { ObservableStatus } from './useObservable';

export class SuspenseSubject<T> extends Subject<T> {
  private _fullStatus: ObservableStatus<T>;
  private _hasValue = false;
  private _timeoutHandler: NodeJS.Timeout;
  private _firstEmission: Promise<void>;
  private _error: any = undefined;
  private _innerObservable: Observable<T>;
  private _warmupSubscription: Subscription;

  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _innerSubscriber: Subscription;
  // @ts-expect-error: TODO: double check to see if this is an RXJS thing or if we should listen to TS
  private _resolveFirstEmission: () => void;

  constructor(innerObservable: Observable<T>, private _timeoutWindow: number) {
    super();

    this._firstEmission = new Promise<void>((resolve) => (this._resolveFirstEmission = resolve));
    this._fullStatus = {
      status: 'loading',
      hasEmitted: false,
      isComplete: false,
      data: undefined,
      error: undefined,
      firstValuePromise: this._firstEmission,
    }

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
        },
        complete: () => {
          this._complete();
        },
      }),
      catchError(() => empty()),
      shareReplay(1)
    );
    // warm up the observable
    this._warmupSubscription = this._innerObservable.subscribe();

    // set a timeout for resetting the cache, subscriptions will cancel the timeout
    // and reschedule again on unsubscribe
    this._timeoutHandler = setTimeout(this._reset.bind(this), this._timeoutWindow);
  }

  set initialData(data: T) {
    // ignore  initialData if we already have data
    if (this._hasValue === true){
      return;
    }

    this._hasValue = true;
    this._fullStatus = {...this._fullStatus,
      data: data,
      hasEmitted: true,
      status: 'success'
    }
  }

  get hasValue(): boolean {
    // hasValue returns true if there's an error too
    // so that after we resolve the promise & useObservable is called again
    // we won't throw again
    return this._hasValue || !!this._error;
  }

  get status(): ObservableStatus<T> {
    if (this._error) {
      throw this._error;
    }

    return this._fullStatus;
  }

  get firstEmission(): Promise<void> {
    return this._firstEmission;
  }

  private _next(value: T) {
    this._resolveFirstEmission();
    this._hasValue = true;

    this._fullStatus = {...this._fullStatus,
      data: value,
      hasEmitted: true,
      status: 'success'
    }
  }

  private _reset() {
    // seems to be undefined in tests?
    if (this._warmupSubscription) {
      this._warmupSubscription.unsubscribe();
    }

    this._firstEmission = new Promise<void>((resolve) => (this._resolveFirstEmission = resolve));

    this._fullStatus = {
      status: 'loading',
      hasEmitted: false,
      isComplete: false,
      data: undefined,
      error: undefined,
      firstValuePromise: this._firstEmission,
    }
  }

  private _complete() {
    this._fullStatus = {...this._fullStatus, isComplete: true};
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
    }
    this._innerSubscriber = this._innerObservable.subscribe(subscriber);
    return this._innerSubscriber;
  }

  get ourError() {
    return this._error;
  }
}
