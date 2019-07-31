import { firestore } from 'firebase/app';
import { doc, fromCollectionRef } from 'rxfire/firestore';
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
): T extends {} ? T : firestore.DocumentSnapshot {
  return useObservable(
    doc(ref),
    ref.path,
    options ? options.startWithValue : undefined
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
): T extends {} ? T[] : firestore.QuerySnapshot {
  return useObservable(
    fromCollectionRef(ref),
    ref.path,
    options ? options.startWithValue : undefined
  );
}
