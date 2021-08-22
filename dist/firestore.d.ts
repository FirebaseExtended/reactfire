import { ReactFireOptions } from './';
import { ObservableStatus } from './useObservable';
import { Query as FirestoreQuery, QuerySnapshot, DocumentReference, DocumentData, DocumentSnapshot } from 'firebase/firestore';
/**
 * Preload a subscription to a Firestore document reference.
 *
 * Use this to warm up `useFirestoreDoc` for a specific document
 */
export declare function preloadFirestoreDoc(refProvider: () => Promise<DocumentReference>): Promise<import("./SuspenseSubject").SuspenseSubject<DocumentSnapshot<DocumentData>>>;
/**
 * Suscribe to Firestore Document changes
 *
 * You can preload data for this hook by calling `preloadFirestoreDoc`
 */
export declare function useFirestoreDoc<T = DocumentData>(ref: DocumentReference<T>, options?: ReactFireOptions<T>): ObservableStatus<DocumentSnapshot<T>>;
/**
 * Get a firestore document and don't subscribe to changes
 */
export declare function useFirestoreDocOnce<T = DocumentData>(ref: DocumentReference<T>, options?: ReactFireOptions<T>): ObservableStatus<DocumentSnapshot<T>>;
/**
 * Suscribe to Firestore Document changes and unwrap the document into a plain object
 */
export declare function useFirestoreDocData<T = unknown>(ref: DocumentReference<T>, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Get a Firestore document, unwrap the document into a plain object, and don't subscribe to changes
 */
export declare function useFirestoreDocDataOnce<T = unknown>(ref: DocumentReference<T>, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Subscribe to a Firestore collection
 */
export declare function useFirestoreCollection<T = DocumentData>(query: FirestoreQuery<T>, options?: ReactFireOptions<T[]>): ObservableStatus<QuerySnapshot<T>>;
/**
 * Subscribe to a Firestore collection and unwrap the snapshot into an array.
 */
export declare function useFirestoreCollectionData<T = DocumentData>(query: FirestoreQuery<T>, options?: ReactFireOptions<T[]>): ObservableStatus<T[]>;
