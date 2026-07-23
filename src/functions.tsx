import { httpsCallable as rxHttpsCallable } from 'rxfire/functions';
import { defer } from 'rxjs';
import { ReactFireOptions, useObservable, ObservableStatus } from './';
import { useFunctions } from '.';

import type { HttpsCallableOptions } from 'firebase/functions';

/**
 * Calls a callable function.
 *
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
  const observableId = `functions:callableResponse:${functionName}:${JSON.stringify(options?.data)}:${JSON.stringify(options?.httpsCallableOptions)}`;
  const obsFactory = rxHttpsCallable<RequestData, ResponseData>(functions, functionName, options?.httpsCallableOptions);
  // Wrap in `defer` so the function is invoked lazily on subscription rather than
  // on every render (each render otherwise calls the cloud function and discards it).
  const observable$ = defer(() => obsFactory(options?.data));

  return useObservable(observableId, observable$, options);
}
