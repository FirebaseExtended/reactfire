import { useEffect, useRef, useState } from 'react';
import {
  subscribe,
  toQueryRef,
  type QueryRef,
  type SerializedRef,
  type DataConnectError,
  type DataSource,
} from 'firebase/data-connect';

export interface SubscriptionState<Data> {
  data: Data | undefined;
  source: DataSource | undefined;
  fetchTime: string | undefined;
  error: DataConnectError | undefined;
  status: 'loading' | 'success' | 'error';
}

export interface UseDataConnectSubscriptionOptions<Data, Variables> {
  initialData?: SerializedRef<Data, Variables>;
}

export function useDataConnectSubscription<Data, Variables>(
  queryRef: QueryRef<Data, Variables>,
  options?: UseDataConnectSubscriptionOptions<Data, Variables>,
): SubscriptionState<Data> {
  const seed = options?.initialData;
  const [state, setState] = useState<SubscriptionState<Data>>(() =>
    seed
      ? { data: seed.data, source: seed.source, fetchTime: seed.fetchTime, error: undefined, status: 'success' }
      : { data: undefined, source: undefined, fetchTime: undefined, error: undefined, status: 'loading' },
  );

  const key = `${queryRef.name}:${JSON.stringify(queryRef.variables)}`;
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    const unsubscribe = subscribe<Data, Variables>(queryRef, {
      onNext: (res) => {
        if (!live.current) return;
        setState({
          data: res.data,
          source: res.source,
          fetchTime: res.fetchTime,
          error: undefined,
          status: 'success',
        });
      },
      onErr: (e) => {
        if (!live.current) return;
        setState((prev) => ({ ...prev, error: e, status: 'error' }));
      },
    });
    return () => {
      live.current = false;
      unsubscribe();
    };
  }, [key]);

  return state;
}

export function hydrateQueryRef<Data, Variables>(
  serialized: SerializedRef<Data, Variables>,
): QueryRef<Data, Variables> {
  return toQueryRef<Data, Variables>(serialized);
}
