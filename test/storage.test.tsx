import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot, connectStorageEmulator } from 'firebase/storage';
import { FunctionComponent } from 'react';
import { FirebaseAppProvider, ObservableStatus, StorageProvider, useStorageDownloadURL, useStorageTask } from '../src/index';
import { baseConfig } from './appConfig';
import { renderHook, act as actOnHooks } from '@testing-library/react-hooks';
import * as React from 'react';
import { randomString } from './test-utils';

describe('Storage', () => {
  const app = initializeApp(baseConfig);
  const storage = getStorage(app);
  connectStorageEmulator(storage, 'localhost', 9199);

  const Provider: FunctionComponent = ({ children }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <StorageProvider sdk={storage}>{children}</StorageProvider>
    </FirebaseAppProvider>
  );

  describe('useStorageTask', () => {
    it('returns the same value as uploadTask', async () => {
      const someBytes = Uint8Array.from(Buffer.from(new ArrayBuffer(500_000)));

      const testFileRef = ref(storage, `${randomString()}/${randomString()}.txt`);

      const uploadTask = uploadBytesResumable(testFileRef, someBytes);

      const { result, waitFor } = renderHook(() => useStorageTask<UploadTaskSnapshot>(uploadTask, testFileRef), { wrapper: Provider });

      const uploadTaskSnapshots: Array<UploadTaskSnapshot> = [];
      let hasUploadTaskCompleted = false;
      let uploadTaskError;
      uploadTask.on(
        'state_changed',
        (snap: UploadTaskSnapshot) => {
          uploadTaskSnapshots.push(snap);
        },
        (e) => {
          uploadTaskError = e;
        },
        () => {
          hasUploadTaskCompleted = true;
        }
      );

      await waitFor(() => {
        return hasUploadTaskCompleted && result.current.isComplete;
      });

      expect(result.error).toEqual(uploadTaskError);
      expect(result.all.length).toBeGreaterThanOrEqual(1);

      // filter out the "loading" updates
      const uploadUpdates = result.all.filter((update) => {
        return (update as ObservableStatus<UploadTaskSnapshot>).status === 'success';
      });

      // check that the first update  matches
      expect((uploadUpdates[0] as ObservableStatus<UploadTaskSnapshot>).data).toEqual(uploadTaskSnapshots[0]);

      // check that all bytes are accounted for
      const lastUpdate = result.current as ObservableStatus<UploadTaskSnapshot>;
      expect(lastUpdate.data.bytesTransferred).toEqual(lastUpdate.data.totalBytes);

      // check that the upload is marked as complete
      expect(result.current.isComplete).toEqual(hasUploadTaskCompleted);
    });
  });

  describe('useStorageDownloadURL', () => {
    it('returns the same value as getDownloadURL', async () => {
      const someBytes = Uint8Array.from(Buffer.from(new ArrayBuffer(500_000)));
      const testFileRef = ref(storage, `${randomString()}/${randomString()}.txt`);

      await uploadBytesResumable(testFileRef, someBytes);

      const { result, waitFor } = renderHook(() => useStorageDownloadURL(testFileRef), { wrapper: Provider });

      await actOnHooks(() =>
        waitFor(() => {
          return result.current.status === 'success';
        })
      );

      const downloadUrl = await getDownloadURL(testFileRef);

      expect(result.current.data).toEqual(downloadUrl);
    });
  });
});
