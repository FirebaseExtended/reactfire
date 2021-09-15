import { httpsCallable as rxHttpsCallable } from 'rxfire/functions';
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
  const observable$ = obsFactory(options?.data);

  return useObservable(observableId, observable$, options);
}
