import * as React from 'react';
import { useStorage } from './sdk.js';
import { useSuspenseEnabledFromConfigAndContext } from './firebaseApp.js';
import { ObservableStatus, ReactFireOptions, createInFlightCache, useFirebaseStream } from './useFirebaseStream.js';
import { getDownloadURL, ref } from 'firebase/storage';

import type { UploadTask, UploadTaskSnapshot, StorageReference, FirebaseStorage } from 'firebase/storage';

const storageTaskCache = createInFlightCache<UploadTask, UploadTaskSnapshot>();

function fetchStorageTaskOnce(task: UploadTask): Promise<UploadTaskSnapshot> {
  return new Promise<UploadTaskSnapshot>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        unsub?.();
        resolve(task.snapshot);
      }
    }, 0);
    const unsub = task.on(
      'state_changed',
      (snap) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          unsub?.();
          resolve(snap);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          unsub?.();
          reject(err);
        }
      }
    );
    if (settled) {
      unsub();
    }
  });
}

/**
 * Subscribe to the progress of a storage task
 *
 * @deprecated Track `uploadBytesResumable` progress inside your upload handler or action instead. Will be removed in v5.0.0.
 * @param task - the task you want to listen to
 * @param ref - reference to the blob the task is acting on
 * @param options
 */
export function useStorageTask<T = unknown>(
  task: UploadTask,
  ref: StorageReference,
  options?: ReactFireOptions<T>
): ObservableStatus<UploadTaskSnapshot | T> {
  const taskKey = `storage:task:${ref.toString()}`;

  return useFirebaseStream<{ task: UploadTask; key: string }, UploadTaskSnapshot | T>({
    ref: { task, key: taskKey },
    isEqual: (a, b) => a.task === b.task && a.key === b.key,
    inFlight: storageTaskCache.handle(task, () => fetchStorageTaskOnce(task)),
    subscribe: (onNext, onError) => {
      let emitted = false;
      let completed = false;
      const initialTimer = setTimeout(() => {
        if (!emitted) {
          emitted = true;
          onNext(task.snapshot, completed);
        }
      }, 0);

      const unsubscribe = task.on(
        'state_changed',
        (snap) => {
          emitted = true;
          clearTimeout(initialTimer);
          onNext(snap, completed);
        },
        (error: unknown) => {
          clearTimeout(initialTimer);
          onError(error);
        },
        () => {
          emitted = true;
          completed = true;
          clearTimeout(initialTimer);
          onNext(task.snapshot, true);
        }
      );

      return () => {
        clearTimeout(initialTimer);
        unsubscribe();
      };
    },
    options,
  });
}

const downloadUrlCache = createInFlightCache<string, string>();

/**
 * Subscribe to a storage ref's download URL
 *
 * @param storageRef - reference to the blob you want to download
 * @param options
 */
export function useStorageDownloadURL<T = string>(
  storageRef: StorageReference,
  options?: ReactFireOptions<T>
): ObservableStatus<string | T> {
  const urlKey = `storage:downloadUrl:${storageRef.toString()}`;

  return useFirebaseStream<string, string | T>({
    ref: urlKey,
    inFlight: downloadUrlCache.handle(urlKey, () => getDownloadURL(storageRef)),
    subscribe: (onNext, onError, inFlightPromise) => {
      const reqPromise = (inFlightPromise as Promise<string> | undefined) ?? getDownloadURL(storageRef);
      reqPromise.then(
        (url) => onNext(url, true),
        (error: unknown) => onError(error)
      );
      return () => {};
    },
    options,
    defaultIsComplete: true,
  });
}

/**
 * @deprecated Use `useStorageDownloadURL(ref)` with a standard `<img />` element instead. Will be removed in v5.0.0.
 */
export type StorageImageProps = {
  storagePath: string;
  storage?: FirebaseStorage;
  suspense?: boolean;
  placeHolder?: React.ReactNode;
};

function StorageFromContext(
  props: StorageImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  const storage = useStorage();

  props = { ...props, storage };

  return <INTERNALStorageImage {...props} />;
}

function INTERNALStorageImage(
  props: StorageImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
): React.ReactNode {
  const { storage, storagePath, suspense, placeHolder, ...imgProps } = props;

  const reactfireOptions: ReactFireOptions<string> = {
    suspense: useSuspenseEnabledFromConfigAndContext(suspense),
  };

  if (!storage) {
    throw new Error('Storage was not passed to component INTERNALStorageImage. This should not be possible');
  }

  const { status, data: imgSrc } = useStorageDownloadURL(ref(storage, storagePath), reactfireOptions);

  if (status === 'success') {
    if (!(imgProps.alt || imgProps.alt === '')) {
      console.warn(
        `No alt prop provided for StorageImage with storagePath "${storagePath}"`,
        'img elements must have an alt prop, either with meaningful text, or an empty string for decorative images'
      );
    }

    return <img src={imgSrc} alt={imgProps.alt} {...imgProps} />;
  } else {
    return placeHolder ?? <>''</>;
  }
}

/**
 * @deprecated Use `useStorageDownloadURL(ref)` with a standard `<img />` element instead. Will be removed in v5.0.0.
 */
export function StorageImage(
  props: StorageImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  const { storage } = props;

  if (storage) {
    return <INTERNALStorageImage {...props} />;
  } else {
    return <StorageFromContext {...props} />;
  }
}
