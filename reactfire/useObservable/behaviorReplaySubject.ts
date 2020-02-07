import { Observable, Subject, Subscription, Subscriber } from 'rxjs';
import { tap, share, first } from 'rxjs/operators';

export class BehaviorReplaySubject<T> extends Subject<T> {
  private _value: T | undefined;
  private _hasValue = false;
  private _timeoutHandler: NodeJS.Timeout | undefined;
  private _innerSubscriber: any;
  private _firstEmission: Promise<void>;
  private _resolveFirstEmission: () => void;
  private _error: any = undefined;
  private _innerObservable: Observable<T>;

  constructor(innerObservable: Observable<T>, private _timeoutWindow: number) {
    super();
    this._firstEmission = new Promise<void>(
      resolve => (this._resolveFirstEmission = resolve)
    );
    this._innerObservable = innerObservable.pipe(
      tap(
        v => {
          this._next(v);
        },
        e => {
          // save the error, so that we can raise on subscription or .value
          // resolve the promise, so suspense tries again
          this._error = e;
          this._resolveFirstEmission();
        }
      ),
      share()
    );
    // warm up the observable
    this._innerObservable.pipe(first()).subscribe();
  }

  get hasValue(): boolean {
    // hasValue returns true if there's an error too
    // so that after we resolve the promise & useObservable is called again
    // we won't throw again
    return this._hasValue || !!this._error;
  }

  get value(): T {
    // throw on .value since the first().subscribe would otherwise
    // absorb it, clear the error for retry
    if (this._error) {
      const error = this._error;
      this._error = undefined;
      if (!this._hasValue) {
        // if we cheated around hasValue let's reset the suspense promise too
        this._firstEmission = new Promise<void>(
          resolve => (this._resolveFirstEmission = resolve)
        );
      }
      throw error;
    }
    return this._value;
  }

  get firstEmission(): Promise<void> {
    return this._firstEmission;
  }

  private _next(value: T) {
    this._hasValue = true;
    this._value = value;
    this._resolveFirstEmission();
  }

  private _reset() {
    // set a timeout for reseting the cache, subscriptions will cancel the timeout
    // and reschedule again on unsubscribe
    this._timeoutHandler = setTimeout(() => {
      this._hasValue = false;
      this._value = undefined;
      this._error = undefined;
      this._firstEmission = new Promise<void>(
        resolve => (this._resolveFirstEmission = resolve)
      );
    }, this._timeoutWindow);
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    // throw the error if there is one
    if (this._error) {
      // reset, so they can retry
      const error = this._error;
      this._error = undefined;
      throw error;
    }
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
    }
    this._innerSubscriber = this._innerObservable.subscribe(subscriber);
    return this._innerSubscriber.add(this._reset);
  }
}
