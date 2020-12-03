import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { useStorage, useStorageDownloadURL, useStorageTask } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';

const UploadProgress = ({ uploadTask, storageRef }) => {
  const { status, data: uploadProgress } = useStorageTask(uploadTask, storageRef);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  const { bytesTransferred, totalBytes } = uploadProgress as firebase.storage.UploadTaskSnapshot;

  const percentComplete = Math.round(100 * (bytesTransferred / totalBytes)) + '%';
  console.log(`Uploading image: ${percentComplete} complete`);
  return <span>{percentComplete}</span>;
};

const ImageUploadButton = props => {
  const [uploadTask, setUploadTask] = useState<firebase.storage.UploadTask | undefined>(undefined);
  const [ref, setRef] = useState<firebase.storage.Reference | undefined>(undefined);
  const storage = useStorage();
  const onChange = event => {
    const fileList = event.target.files;
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = storage.ref('images').child(fileName);
    setRef(newRef);

    const uploadTask = newRef.put(fileToUpload);

    uploadTask.then(() => {
      console.log('upload complete');
      setUploadTask(undefined);
    });
    setUploadTask(uploadTask);
  };

  return (
    <>
      <input type="file" accept="image/png, image/jpeg" onChange={onChange} />
      {uploadTask ? <UploadProgress uploadTask={uploadTask} storageRef={ref} /> : 'Start an upload to view progress'}
    </>
  );
};

const FetchImage = ({ storagePath }) => {
  const storage = useStorage();

  const { status, data: imageURL } = useStorageDownloadURL(storage.ref(storagePath));
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return <img src={imageURL} alt="demo download" style={{ width: '200px', height: '200px' }} />;
};

export function Storage() {
  return (
    <AuthWrapper fallback={<span>Sign in to use this component</span>}>
      <CardSection title="Fetch image">
        <FetchImage storagePath="Cloud Storage for Firebase (Independent Icon).png" />
      </CardSection>
      <CardSection title="Upload image">
        <ImageUploadButton />
      </CardSection>
    </AuthWrapper>
  );
}
