import { useRef } from 'react';

export interface ListenOptions<T> {
  initialData?: T | undefined;
}

export interface IdleListenResult {
  status: 'idle';
  loading: false;
  pending: true;
  data: undefined;
  error: undefined;
}

export interface LoadingListenResult {
  status: 'loading';
  loading: true;
  pending: true;
  data: undefined;
  error: undefined;
}

export interface SuccessListenResult<T> {
  status: 'success';
  loading: false;
  pending: false;
  data: T;
  error: undefined;
}

export interface ErrorListenResult<T = undefined> {
  status: 'error';
  loading: false;
  pending: false;
  data: T;
  error: Error;
}

export type ListenResult<T> =
  | IdleListenResult
  | LoadingListenResult
  | SuccessListenResult<T>
  | ErrorListenResult<T | undefined>;

export type SeededListenResult<T> =
  | SuccessListenResult<T>
  | ErrorListenResult<T>;

// Backwards-compatible type aliases for ReactFire v4 upgraders
export type ObservableStatus<T> = ListenResult<T>;
export type InitialDataObservableStatus<T> = SeededListenResult<T>;
export type IdleObservableStatus = IdleListenResult;

const IDLE_STATUS: IdleListenResult = Object.freeze({
  status: 'idle',
  loading: false,
  pending: true,
  data: undefined,
  error: undefined,
});

const LOADING_STATUS: LoadingListenResult = Object.freeze({
  status: 'loading',
  loading: true,
  pending: true,
  data: undefined,
  error: undefined,
});

export function idleStatus(): IdleListenResult {
  return IDLE_STATUS;
}

export function loadingStatus(): LoadingListenResult {
  return LOADING_STATUS;
}

export function successStatus<T>(data: T): SuccessListenResult<T> {
  return {
    status: 'success',
    loading: false,
    pending: false,
    data,
    error: undefined,
  };
}

export function errorStatus(error: Error): ErrorListenResult<undefined>;
export function errorStatus<T>(error: Error, data: T): ErrorListenResult<T>;
export function errorStatus<T>(
  error: Error,
  data?: T
): ErrorListenResult<T | undefined> {
  return {
    status: 'error',
    loading: false,
    pending: false,
    data,
    error,
  };
}

export function useStableRef<T>(
  value: T,
  isEqual: (a: NonNullable<T>, b: NonNullable<T>) => boolean
): T {
  const ref = useRef<T>(value);
  if (value == null || ref.current == null || !isEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
}
