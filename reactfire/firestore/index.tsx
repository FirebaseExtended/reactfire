import { firestore } from 'firebase/app';
import { doc, collectionData, fromCollectionRef, docData } from 'rxfire/firestore';
import { ReactFireOptions, useObservable } from '..';

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDoc<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): firestore.DocumentSnapshot | T {
  return useObservable(
    doc(ref),
    ref.path,
    options ? options.startWithValue : undefined
  );
}

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export function useFirestoreDocData<T = unknown>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<T>
): T {
  return useObservable(
    docData(ref, checkIdField(options)),
    ref.path,
    checkStartWithValue(options)
  );
}

/**
 * Subscribe to a Firestore collection
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollection<T = { [key: string]: unknown }>(
  ref: firestore.CollectionReference,
  options?: ReactFireOptions<T[]>
): firestore.QuerySnapshot | T[] {
  return useObservable(
    fromCollectionRef(ref),
    ref.path,
    options ? options.startWithValue : undefined
  );
}

/**
 * Subscribe to a Firestore collection and unwrap the snapshot.
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export function useFirestoreCollectionData<T = { [key: string]: unknown }>(
  ref: firestore.CollectionReference,
  options?: ReactFireOptions<T[]>
): T[] {
  return useObservable(
    collectionData(ref, checkIdField(options)),
    ref.path,
    checkStartWithValue(options)
  );
}

function checkOptions(options: ReactFireOptions, field: string) {
  return options ? options[field] : undefined;
}

function checkStartWithValue(options: ReactFireOptions) {
  return checkOptions(options, 'startWithValue');
}

function checkIdField(options: ReactFireOptions) {
  return checkOptions(options, 'idField');
}
