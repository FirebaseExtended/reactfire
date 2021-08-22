import { Observable } from 'rxjs';
import { SuspenseSubject } from './SuspenseSubject';
import { ReactFireOptions } from './';
export declare function preloadObservable<T>(source: Observable<T>, id: string): SuspenseSubject<T>;
export interface ObservableStatus<T> {
    /**
     * The loading status.
     *
     * - `loading`: Waiting for the first value from an observable
     * - `error`: Something went wrong. Check `ObservableStatus.error` for more details
     * - `success`: The hook has emitted at least one value
     *
     * If `initialData` is passed in, this will skip `loading` and go straight to `success`.
     */
    status: 'loading' | 'error' | 'success';
    /**
     * Indicates whether the hook has emitted a value at some point
     *
     * If `initialData` is passed in, this will be `true`.
     */
    hasEmitted: boolean;
    /**
     * If this is `true`, the hook will be emitting no further items.
     */
    isComplete: boolean;
    /**
     * The most recent value.
     *
     * If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.
     */
    data: T;
    /**
     * Any error that may have occurred in the underlying observable
     */
    error: Error | undefined;
    /**
     * Promise that resolves after first emit from observable
     */
    firstValuePromise: Promise<void>;
}
export declare function useObservable<T = unknown>(observableId: string, source: Observable<T>, config?: ReactFireOptions): ObservableStatus<T>;
