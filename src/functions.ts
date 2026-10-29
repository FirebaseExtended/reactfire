import { useEffect, useState } from 'react';
import {
  httpsCallable,
  type Functions,
  type HttpsCallableOptions,
} from 'firebase/functions';
import {
  errorStatus,
  loadingStatus,
  successStatus,
  type ListenOptions,
  type ListenResult,
} from './core.js';

export interface CallableFunctionOptions<RequestData, ResponseData>
  extends ListenOptions<ResponseData> {
  httpsCallableOptions?: HttpsCallableOptions | undefined;
  data?: RequestData | undefined;
}

export function useCallableFunctionResponse<RequestData = unknown, ResponseData = unknown>(
  functions: Functions,
  functionName: string,
  options?: CallableFunctionOptions<RequestData, ResponseData>
): ListenResult<ResponseData> {
  const dataKey = JSON.stringify(options?.data);
  const optsKey = JSON.stringify(options?.httpsCallableOptions);

  const [state, setState] = useState<ListenResult<ResponseData>>(() =>
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
    let active = true;
    const callable = httpsCallable<RequestData, ResponseData>(
      functions,
      functionName,
      options?.httpsCallableOptions
    );
    callable(options?.data).then(
      (res) => active && setState(successStatus(res.data)),
      (e) => {
        if (active) {
          const err = e instanceof Error ? e : new Error(String(e));
          setState((prev) => errorStatus(err, prev.data));
        }
      }
    );
    return () => {
      active = false;
    };
  }, [functions, functionName, dataKey, optsKey]);

  return state;
}
