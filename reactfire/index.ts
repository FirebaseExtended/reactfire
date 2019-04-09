import { auth, firestore, User, database, storage } from 'firebase/app';
import { user } from 'rxfire/auth';
import { fromCollectionRef, doc } from 'rxfire/firestore';
import { object, list, QueryChange } from 'rxfire/database';
import { useObservable } from './util/use-observable';
import { getDownloadURL } from 'rxfire/storage';
import { Observable, from } from 'rxjs';

export function useUser(auth: auth.Auth): User {
  return useObservable(user(auth), 'user');
}

export function useFirestoreDoc(
  ref: firestore.DocumentReference
): firestore.DocumentSnapshot {
  return useObservable(doc(ref), ref.path);
}

export function useFirestoreCollection(
  ref: firestore.CollectionReference
): firestore.QuerySnapshot {
  return useObservable(fromCollectionRef(ref), ref.path);
}

export function useDatabaseObject(ref: database.Reference): QueryChange {
  return useObservable(object(ref), ref.toString());
}

export function useDatabaseList(
  ref: database.Reference | database.Query
): QueryChange[] {
  return useObservable(list(ref), ref.toString());
}

export function _fromTask(task: storage.UploadTask) {
  return new Observable<storage.UploadTaskSnapshot>(subscriber => {
    const progress = (snap: storage.UploadTaskSnapshot) => {
      return subscriber.next(snap);
    };
    const error = e => subscriber.error(e);
    const complete = () => {
      return subscriber.complete();
    };
    task.on('state_changed', progress, error, complete);

    // I REMOVED THE UNSUBSCRIBE RETURN BECAUSE IT CANCELS THE UPLOAD
    // https://github.com/firebase/firebase-js-sdk/issues/1659
  });
}

export function useStorageTask(
  task: storage.UploadTask,
  ref: storage.Reference
): storage.UploadTaskSnapshot {
  return useObservable(_fromTask(task), 'upload' + ref.toString());
}

export function useStorageDownloadURL(ref: storage.Reference): string {
  return useObservable(getDownloadURL(ref), 'download' + ref.toString());
}
