import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import React, { Suspense, useState } from 'react';
import { useStorageTask, useUser } from 'reactfire';

const UploadProgress = ({ uploadTask, storageRef }) => {
  const { bytesTransferred, totalBytes } = useStorageTask(
    uploadTask,
    storageRef
  );

  const percentComplete =
    Math.round(100 * (bytesTransferred / totalBytes)) + '%';

  return <span>{percentComplete}</span>;
};

const ImageUploadButton = props => {
  const [uploadTask, setUploadTask] = useState(null);
  const [ref, setRef] = useState(null);

  const onChange = event => {
    const fileList = event.target.files;
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = firebase
      .storage()
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
        <Suspense fallback="waiting for progress...">
          <UploadProgress uploadTask={uploadTask} storageRef={ref} />
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};

const AuthCheck = props => {
  const user = useUser(firebase.auth());

  // TODO: check props.requiredClaims

  if (!user) {
    return props.fallback;
  } else {
    return props.children;
  }
};

const SuspenseWrapper = props => {
  return (
    <Suspense fallback="loading...">
      <AuthCheck fallback="sign in to use Storage">
        <ImageUploadButton />
      </AuthCheck>
    </Suspense>
  );
};

export default SuspenseWrapper;
