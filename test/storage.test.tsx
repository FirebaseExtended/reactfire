import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot, connectStorageEmulator } from 'firebase/storage';
import { FunctionComponent } from 'react';
import { FirebaseAppProvider, ObservableStatus, StorageProvider, useStorageDownloadURL, useStorageTask } from '../src/index';
import { baseConfig } from './appConfig';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as React from 'react';
import { randomString } from './test-utils';

describe('Storage', () => {
  const app = initializeApp(baseConfig);
  const storage = getStorage(app);
  connectStorageEmulator(storage, 'localhost', 9199);

  const Provider: FunctionComponent<{children: React.ReactNode}> = ({ children }) => (
    <FirebaseAppProvider firebaseApp={app}>
      <StorageProvider sdk={storage}>{children}</StorageProvider>
    </FirebaseAppProvider>
  );

  describe('useStorageTask', () => {
    it('returns the same value as uploadTask', async () => {
      const someBytes = Uint8Array.from(Buffer.from(new ArrayBuffer(500_000)));

      const testFileRef = ref(storage, `${randomString()}/${randomString()}.txt`);

      const uploadTask = uploadBytesResumable(testFileRef, someBytes);

      const { result } = renderHook(() => useStorageTask<UploadTaskSnapshot>(uploadTask, testFileRef), { wrapper: Provider });

      const uploadTaskSnapshots: Array<UploadTaskSnapshot> = [];
      let hasUploadTaskCompleted = false;
      uploadTask.on(
        'state_changed',
        (snap: UploadTaskSnapshot) => {
          uploadTaskSnapshots.push(snap);
        },
        (e) => {
          throw e
        },
        () => {
          hasUploadTaskCompleted = true;
        }
      );

      // check that the first update  matches
      await waitFor(() => {
        expect(result.current.data).toEqual(uploadTaskSnapshots[0])
      })

      // check that all bytes are accounted for when upload is marked as complete
      await waitFor(() => {
        expect(hasUploadTaskCompleted).toEqual(true);
        expect(result.current.isComplete).toEqual(true);
        expect(result.current.data.bytesTransferred).toEqual(result.current.data.totalBytes)
      })      
    });
  });

  describe('useStorageDownloadURL', () => {
    it('returns the same value as getDownloadURL', async () => {
      const someBytes = Uint8Array.from(Buffer.from(new ArrayBuffer(500_000)));
      const testFileRef = ref(storage, `${randomString()}/${randomString()}.txt`);

      await uploadBytesResumable(testFileRef, someBytes);

      const { result } = renderHook(() => useStorageDownloadURL(testFileRef), { wrapper: Provider });

      await waitFor(() => expect(result.current.status).toEqual('success'));

      const downloadUrl = await getDownloadURL(testFileRef);

      expect(result.current.data).toEqual(downloadUrl);
    });
  });
});
