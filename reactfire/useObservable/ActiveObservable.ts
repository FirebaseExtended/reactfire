import { first, tap, takeUntil, shareReplay, startWith } from 'rxjs/operators';
import { Observable, timer, observable } from 'rxjs';
type Observer<T> = import('rxjs').Observer<T>;

export class ActiveObservable {
  observable$: Observable<any>;
  isReady: boolean;
  value: any = undefined;
  error: Error;
  subscribers: number = 0;

  constructor(observable$: Observable<any>, startWithValue?) {
    if (startWithValue) {
      this.value = startWithValue;
      this.isReady = true;
      observable$ = observable$.pipe(startWith(startWithValue));
    } else {
      this.isReady = false;
    }

    // create a shared observable
    // we need to keep track of the latest value emitted so that we can tell React
    // whether the component subscribed to this observable is ready to render
    this.observable$ = observable$.pipe(
      tap(
        newVal => {
          this.setValue(newVal);
        },
        error => {
          this.setError(error);
          throw error;
        }
      ),
      shareReplay({
        bufferSize: 1, // only cache the latest value
        refCount: true // clean up the subscription if we don't have any subscribers
      })
    );
  }

  subscribeTemporarily(timeout: number, onComplete) {
    this.subscribers++;

    this.observable$
      .pipe(takeUntil(timer(timeout)))
      .subscribe(
        () => {},
        () => {},
        () => {
          this.subscribers--;
          // onComplete()
        }
      )
      .add(onComplete);
  }

  subscribe(observer: Observer<any>) {
    this.subscribers++;
    const subscription = this.observable$.subscribe(observer);

    subscription.add(() => {
      console.log('UNSUBSCRIBE CALLED');
      this.subscribers--;
    });
    return subscription;
  }

  getPromise() {
    return this.observable$.pipe(first()).toPromise();
  }

  setValue = value => {
    this.value = value;
    this.isReady = true;
  };

  setError = err => {
    this.error = err;
    this.isReady = true;
  };
}
