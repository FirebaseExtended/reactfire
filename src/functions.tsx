import { httpsCallable } from 'firebase/functions';
import { useFunctions } from './sdk.js';
import { ObservableStatus, ReactFireOptions, createInFlightCache, useFirebaseStream } from './useFirebaseStream.js';

import type { Functions, HttpsCallableOptions } from 'firebase/functions';

const callableCache = createInFlightCache<string, any>();

/**
 * Calls a callable function.
 *
 * @deprecated Call `httpsCallable(functions, functionName)` directly (e.g. inside React 19 `useActionState` or an event handler). Will be removed in v5.0.0.
 * @param functionName - The name of the function to call
 * @param options
 */
export function useCallableFunctionResponse<RequestData, ResponseData>(
  functionName: string,
  options?: ReactFireOptions<ResponseData> & {
    httpsCallableOptions?: HttpsCallableOptions;
    data?: RequestData;
  }
): ObservableStatus<ResponseData> {
  const functions = useFunctions();
  const callKey = `functions:callableResponse:${functions.app.name}:${functionName}:${JSON.stringify(options?.data)}:${JSON.stringify(options?.httpsCallableOptions)}`;

  return useFirebaseStream<{ functions: Functions; key: string }, ResponseData>({
    ref: { functions, key: callKey },
    isEqual: (a, b) => a.functions === b.functions && a.key === b.key,
    inFlight: callableCache.handle(callKey, () =>
      httpsCallable<RequestData, ResponseData>(
        functions,
        functionName,
        options?.httpsCallableOptions
      )(options?.data).then((result) => result.data)
    ),
    subscribe: (onNext, onError, inFlightPromise) => {
      const reqPromise =
        inFlightPromise ??
        httpsCallable<RequestData, ResponseData>(
          functions,
          functionName,
          options?.httpsCallableOptions
        )(options?.data).then((result) => result.data);

      reqPromise.then(
        (value) => onNext(value, true),
        (error: unknown) => onError(error)
      );
      return () => {};
    },
    options,
    defaultIsComplete: true,
  });
}
