import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  type StorageError,
  type StorageReference,
  type UploadTask,
  type UploadTaskSnapshot,
} from 'firebase/storage';
import {
  errorStatus,
  idleStatus,
  loadingStatus,
  successStatus,
  useStableRef,
  type ListenOptions,
  type ListenResult,
} from './core.js';

const sameStorageRef = (a: StorageReference, b: StorageReference) =>
  a.storage === b.storage && a.fullPath === b.fullPath;

export function useStorageDownloadURL(
  ref: StorageReference | null | undefined,
  options?: ListenOptions<string>
): ListenResult<string> {
  const stableRef = useStableRef(ref, sameStorageRef);
  const [state, setState] = useState<ListenResult<string>>(() =>
    !stableRef
      ? idleStatus()
      : options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
  );

  useEffect(() => {
    if (!stableRef) {
      setState(idleStatus());
      return;
    }
    setState(
      options?.initialData !== undefined
        ? successStatus(options.initialData)
        : loadingStatus()
    );
    let active = true;
    getDownloadURL(stableRef).then(
      (url) => active && setState(successStatus(url)),
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
  }, [stableRef]);

  return state;
}

export function useStorageTask(
  task: UploadTask | null | undefined,
  options?: ListenOptions<UploadTaskSnapshot>
): ListenResult<UploadTaskSnapshot> {
  const [state, setState] = useState<ListenResult<UploadTaskSnapshot>>(() =>
    !task
      ? idleStatus()
      : successStatus(options?.initialData ?? task.snapshot)
  );

  useEffect(() => {
    if (!task) {
      setState(idleStatus());
      return;
    }
    setState(successStatus(options?.initialData ?? task.snapshot));
    const unsub = task.on(
      'state_changed',
      (snap) => setState(successStatus(snap)),
      (err: StorageError) => setState(errorStatus(err, task.snapshot)),
      () => setState(successStatus(task.snapshot))
    );
    return () => {
      unsub();
    };
  }, [task]);

  return state;
}
