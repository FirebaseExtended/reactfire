import {
  Observable,
  Subject,
  Subscription,
  Subscriber,
  throwError
} from 'rxjs';
import { tap, share, first } from 'rxjs/operators';

export class BehaviorReplaySubject<T> extends Subject<T> {
  private _value: T | undefined;
  private _hasValue = false;
  private _timeoutHandler: NodeJS.Timeout | undefined;
  private _innerSubscriber: any;
  private _first: Promise<void>;
  private _resolveFirst: () => void;
  private _error: any = undefined;
  private _innerObservable: Observable<T>;

  constructor(
    innerObservable: Observable<T>,
    private _timeoutWindow: number,
    private _id?: string,
    private _defaultValue?: T
  ) {
    super();
    this._first = new Promise<void>(resolve => (this._resolveFirst = resolve));
    this._innerObservable = innerObservable.pipe(
      tap(
        v => {
          this._next(v);
        },
        e => {
          this._error = e;
          this._resolveFirst();
        }
      ),
      share()
    );
    this._innerObservable.pipe(first()).subscribe();
  }

  get hasValue(): boolean {
    return this._hasValue || !!this._error;
  }

  get value(): T {
    if (this._error) {
      const error = this._error;
      this._error = undefined;
      if (!this._hasValue) {
        this._first = new Promise<void>(
          resolve => (this._resolveFirst = resolve)
        );
      }
      throw error;
    }
    return this._value;
  }

  get firstEmission(): Promise<void> {
    return this._first;
  }

  _next(value: T) {
    this._hasValue = true;
    this._value = value;
    this._resolveFirst();
  }

  _reset() {
    this._timeoutHandler = setTimeout(() => {
      this._hasValue = false;
      this._value = undefined;
      this._error = undefined;
      this._first = new Promise<void>(
        resolve => (this._resolveFirst = resolve)
      );
    }, this._timeoutWindow);
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    if (this._error) {
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
