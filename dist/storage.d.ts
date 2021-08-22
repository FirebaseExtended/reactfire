import * as React from 'react';
import { ReactFireOptions, ObservableStatus } from './';
import type { UploadTask, UploadTaskSnapshot, StorageReference, FirebaseStorage } from 'firebase/storage';
/**
 * Subscribe to the progress of a storage task
 *
 * @param task - the task you want to listen to
 * @param ref - reference to the blob the task is acting on
 * @param options
 */
export declare function useStorageTask<T = unknown>(task: UploadTask, ref: StorageReference, options?: ReactFireOptions<T>): ObservableStatus<UploadTaskSnapshot | T>;
/**
 * Subscribe to a storage ref's download URL
 *
 * @param ref - reference to the blob you want to download
 * @param options
 */
export declare function useStorageDownloadURL<T = string>(ref: StorageReference, options?: ReactFireOptions<T>): ObservableStatus<string | T>;
declare type StorageImageProps = {
    storagePath: string;
    storage?: FirebaseStorage;
    suspense?: boolean;
    placeHolder?: JSX.Element;
};
export declare function StorageImage(props: StorageImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>): JSX.Element;
export {};
