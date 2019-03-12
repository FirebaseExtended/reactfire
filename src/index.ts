import * as React from 'react';
import { user } from 'rxfire/auth';
import { auth, User } from 'firebase/app';
import { collection } from 'rxfire/firestore';
import { first, map } from 'rxjs/operators';

export function tester(): string {
  return 'hello world';
}

export function useUser(auth: auth.Auth): User {
  const [currentUser, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const activePromise = React.useRef();

  if (isLoading) {
    throw activePromise.current;
  }

  React.useEffect(() => {
    const observable = user(auth);

    activePromise.current = observable.pipe(first()).toPromise();
    setIsLoading(true);
    const subscription = observable.subscribe(
      u => {
        setIsLoading(false);
        setUser(u);
      },
      error => {
        throw new Error(JSON.stringify(error));
      }
    );

    return subscription.unsubscribe;
  }, []);

  return currentUser;
}
