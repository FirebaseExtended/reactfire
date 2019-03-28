import { auth, firestore, User } from 'firebase/app';
import { user } from 'rxfire/auth';
import { collection, doc } from 'rxfire/firestore';
import { useObservable } from './util/use-observable';

export function useUser(auth: auth.Auth): User {
  return useObservable(user(auth), 'user');
}

export function useFirestoreDoc(ref: firestore.DocumentReference) {
  return useObservable(doc(ref), ref.path);
}

export function useFirestoreCollection(ref: firestore.CollectionReference) {
  return useObservable(collection(ref), ref.path);
}
