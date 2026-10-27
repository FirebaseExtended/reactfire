import { httpsCallable } from 'firebase/functions';
import { useFunctions } from './sdk.js';
import { InstrumentedPromise, ObservableStatus, ReactFireOptions, instrumentPromise, useFirebaseStream } from './useFirebaseStream.js';

import type { Functions, HttpsCallableOptions } from 'firebase/functions';

const IN_FLIGHT_EVICT_MS = 5_000;
const inFlightCallablePromises = new Map<string, InstrumentedPromise<any>>();

function getOrStartCallable<RequestData, ResponseData>(
  functions: Functions,
  functionName: string,
  callKey: string,
  data?: RequestData,
  httpsCallableOptions?: HttpsCallableOptions
): InstrumentedPromise<ResponseData> {
  let promise = inFlightCallablePromises.get(callKey) as InstrumentedPromise<ResponseData> | undefined;
  if (!promise) {
    const callable = httpsCallable<RequestData, ResponseData>(functions, functionName, httpsCallableOptions);
    promise = instrumentPromise(callable(data).then((result) => result.data));
    inFlightCallablePromises.set(callKey, promise);
    const cleanup = () => setTimeout(() => inFlightCallablePromises.delete(callKey), IN_FLIGHT_EVICT_MS);
    promise.then(cleanup, cleanup);
  }
  return promise;
}

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
    peekInFlight: () => inFlightCallablePromises.get(callKey) as InstrumentedPromise<ResponseData> | undefined,
    getOrStartInFlight: () =>
      getOrStartCallable<RequestData, ResponseData>(
        functions,
        functionName,
        callKey,
        options?.data,
        options?.httpsCallableOptions
      ),
    clearInFlight: (expectedPromise) => {
      if (!expectedPromise || inFlightCallablePromises.get(callKey) === expectedPromise) {
        inFlightCallablePromises.delete(callKey);
      }
    },
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
