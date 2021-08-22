import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
export declare class SuspenseSubject<T> extends Subject<T> {
    private _timeoutWindow;
    private _value;
    private _hasValue;
    private _timeoutHandler;
    private _firstEmission;
    private _error;
    private _innerObservable;
    private _warmupSubscription;
    private _innerSubscriber;
    private _resolveFirstEmission;
    constructor(innerObservable: Observable<T>, _timeoutWindow: number);
    get hasValue(): boolean;
    get value(): T | undefined;
    get firstEmission(): Promise<void>;
    private _next;
    private _reset;
    _subscribe(subscriber: Subscriber<T>): Subscription;
    get ourError(): any;
}
