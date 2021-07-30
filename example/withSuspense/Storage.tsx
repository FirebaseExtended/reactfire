import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { StorageProvider, useFirebaseApp, useStorage, useStorageDownloadURL, useStorageTask, SuspenseWithPerf } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';
import { ref, uploadBytesResumable, getStorage } from 'firebase/storage';

import type { UploadTaskSnapshot, UploadTask, StorageReference } from 'firebase/storage';

const UploadProgress = ({ uploadTask, storageRef }) => {
  const { data: uploadProgress } = useStorageTask<UploadTaskSnapshot>(uploadTask, storageRef);

  const { bytesTransferred, totalBytes } = uploadProgress;

  const percentComplete = Math.round(100 * (bytesTransferred / totalBytes)) + '%';
  console.log(`Uploading image: ${percentComplete} complete`);
  return <span>{percentComplete}</span>;
};

const ImageUploadButton = (props) => {
  const [uploadTask, setUploadTask] = useState<UploadTask | undefined>(undefined);
  const [imageRef, setRef] = useState<StorageReference | undefined>(undefined);
  const storage = useStorage();
  const onChange = (event) => {
    const fileList = event.target.files;
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = ref(storage, `images/${fileName}`);
    setRef(newRef);

    const uploadTask = uploadBytesResumable(newRef, fileToUpload);

    uploadTask.then(() => {
      console.log('upload complete');
      setUploadTask(undefined);
    });
    setUploadTask(uploadTask);
  };

  return (
    <>
      <input type="file" accept="image/png, image/jpeg" onChange={onChange} />
      {uploadTask ? <UploadProgress uploadTask={uploadTask} storageRef={imageRef} /> : 'Start an upload to view progress'}
    </>
  );
};

const FetchImage = ({ storagePath }) => {
  const storage = useStorage();

  const { data: imageURL } = useStorageDownloadURL(ref(storage, storagePath));

  return <img src={imageURL} alt="demo download" style={{ width: '200px', height: '200px' }} />;
};

export function Storage() {
  const app = useFirebaseApp();
  return (
    <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="storage-root">
      <AuthWrapper fallback={<span>Sign in to use this component</span>}>
        <StorageProvider sdk={getStorage(app)}>
          <CardSection title="Fetch image">
            <FetchImage storagePath="Cloud Storage for Firebase (Independent Icon).png" />
          </CardSection>
          <CardSection title="Upload image">
            <ImageUploadButton />
          </CardSection>
        </StorageProvider>
      </AuthWrapper>
    </SuspenseWithPerf>
  );
}
