import React, { useState } from 'react';
import {
  SuspenseWithPerf,
  useStorageTask,
  AuthCheck,
  StorageImage,
  useStorage
} from 'reactfire';

const UploadProgress = ({ uploadTask, storageRef }) => {
  const { data: uploadStatus } = useStorageTask(
    uploadTask,
    storageRef
  );

  const { bytesTransferred, totalBytes } = uploadStatus;

  const percentComplete =
    Math.round(100 * (bytesTransferred / totalBytes)) + '%';

  return <span>{percentComplete}</span>;
};

const ImageUploadButton = props => {
  const [uploadTask, setUploadTask] = useState(null);
  const [ref, setRef] = useState(null);
  const storage = useStorage();
  const onChange = event => {
    const fileList = event.target.files;
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = storage
      .ref('images')
      .child(fileName);
    setRef(newRef);

    const uploadTask = newRef.put(fileToUpload);

    uploadTask.then(() => {
      console.log('upload complete');
      setUploadTask(null);
    });
    setUploadTask(uploadTask);
  };

  return (
    <>
      <input type="file" accept="image/png, image/jpeg" onChange={onChange} />
      {uploadTask ? (
        <SuspenseWithPerf
          fallback="waiting for progress..."
          traceId="storage-upload"
        >
          <UploadProgress uploadTask={uploadTask} storageRef={ref} />
        </SuspenseWithPerf>
      ) : (
          ''
        )}
    </>
  );
};

const SuspenseWrapper = props => {
  return (
    <SuspenseWithPerf fallback="loading..." traceId="storage-root">
      <AuthCheck fallback="sign in to use Storage">
        <StorageImage
          storagePath="Cloud Storage for Firebase (Independent Icon).png"
          alt="demo download"
          style={{ width: '200px', height: '200px' }}
        />
        <br />
        <ImageUploadButton />
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default SuspenseWrapper;
