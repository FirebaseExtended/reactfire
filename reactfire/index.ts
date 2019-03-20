import * as React from 'react';
import { user } from 'rxfire/auth';
import { auth, User } from 'firebase/app';
import { collection } from 'rxfire/firestore';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export function useUser(auth: auth.Auth): User {
  return useObservable(user(auth));
}

export function useObservable(observable$: Observable<any>) {
  const [latestValue, setValue] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const activePromise = React.useRef();

  if (isLoading) {
    throw activePromise.current;
  }

  React.useEffect(() => {
    activePromise.current = observable$.pipe(first()).toPromise();
    setIsLoading(true);
    const subscription = observable$.subscribe(
      u => {
        setIsLoading(false);
        setValue(u);
      },
      error => {
        console.warn('There was an error', error);
        throw new Error(JSON.stringify(error));
      }
    );

    return subscription.unsubscribe;
  }, []);

  return latestValue;
}
