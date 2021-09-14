import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { useFirebaseApp, FunctionsProvider, useFunctions, useCallableFunctionResponse } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { WideButton } from '../display/Button';
import { getFunctions, httpsCallable } from 'firebase/functions';

function UpperCaser() {
  const functions = useFunctions();
  const capitalizeTextRemoteFunction = httpsCallable<{ text: string }, string>(functions, 'capitalizeText');
  const [uppercasedText, setText] = useState<string>('');
  const [isUppercasing, setIsUppercasing] = useState<boolean>(false);

  const greetings = ['Hello World', 'yo', `what's up?`];
  const textToUppercase = greetings[Math.floor(Math.random() * greetings.length)];

  async function handleButtonClick() {
    setIsUppercasing(true);

    const { data: capitalizedText } = await capitalizeTextRemoteFunction({ text: textToUppercase });
    setText(capitalizedText);

    setIsUppercasing(false);
  }

  return (
    <>
      <WideButton label="Uppercase some text" onClick={handleButtonClick} />
      {isUppercasing ? <LoadingSpinner /> : <span>{uppercasedText || `click the button to capitalize "${textToUppercase}"`}</span>}
    </>
  );
}

function UpperCaserOnRender() {
  const greetings = ['Hello World', 'yo', `what's up?`];
  const textToUppercase = greetings[Math.floor(Math.random() * greetings.length)];
  const { status, data: uppercasedText } = useCallableFunctionResponse<{ text: string }, string>('capitalizeText', { data: { text: textToUppercase } });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return <span>{uppercasedText}</span>;
}

export function Functions() {
  const app = useFirebaseApp();

  return (
    <FunctionsProvider sdk={getFunctions(app)}>
      <CardSection title="Call a cloud function">
        <UpperCaser />
      </CardSection>
      <CardSection title="Call a function on render">
        <UpperCaserOnRender />
      </CardSection>
    </FunctionsProvider>
  );
}
