import { useEffect, useState } from 'react';
import {
  getIdTokenResult,
  onIdTokenChanged,
  type Auth,
  type IdTokenResult,
  type User,
} from 'firebase/auth';
import {
  errorStatus,
  loadingStatus,
  successStatus,
  type ListenOptions,
  type ListenResult,
} from './core.js';

export function useUser(
  auth: Auth,
  options?: ListenOptions<User | null>
): ListenResult<User | null> {
  const [state, setState] = useState<ListenResult<User | null>>(() => {
    if (options?.initialData !== undefined) return successStatus(options.initialData);
    if (auth.currentUser) return successStatus(auth.currentUser);
    return loadingStatus();
  });

  useEffect(() => {
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : auth.currentUser
          ? successStatus(auth.currentUser)
          : loadingStatus()
    );
    return onIdTokenChanged(
      auth,
      (user) => setState(successStatus(user)),
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [auth]);

  return state;
}

export interface IdTokenResultOptions extends ListenOptions<IdTokenResult | null> {
  forceRefresh?: boolean | undefined;
}

export function useIdTokenResult(
  auth: Auth,
  options?: IdTokenResultOptions
): ListenResult<IdTokenResult | null> {
  const forceRefresh = !!options?.forceRefresh;
  const [state, setState] = useState<ListenResult<IdTokenResult | null>>(() =>
    options?.initialData !== undefined
      ? successStatus(options.initialData)
      : loadingStatus()
  );

  useEffect(() => {
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
    );
    let seq = 0;
    return onIdTokenChanged(
      auth,
      (user) => {
        const mySeq = ++seq;
        if (!user) {
          setState(successStatus(null));
          return;
        }
        getIdTokenResult(user, forceRefresh).then(
          (res) => {
            if (mySeq === seq) setState(successStatus(res));
          },
          (e) => {
            if (mySeq === seq) {
              const err = e instanceof Error ? e : new Error(String(e));
              setState((prev) => errorStatus(err, prev.data));
            }
          }
        );
      },
      (err) => setState((prev) => errorStatus(err, prev.data))
    );
  }, [auth, forceRefresh]);

  return state;
}
