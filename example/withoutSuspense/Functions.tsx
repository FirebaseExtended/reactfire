import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { useFirebaseApp, FunctionsProvider, useFunctions } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { WideButton } from '../display/Button';
import { getFunctions, httpsCallable } from 'firebase/functions';

function UpperCaser() {
  const functions = useFunctions();
  const capitalizeTextRemoteFunction = httpsCallable<{ text: string }, string>(functions, 'capitalizeText');
  const [uppercasedText, setText] = useState<string>('');
  const [isUppercasing, setIsUppercasing] = useState<boolean>(false);

  async function handleButtonClick() {
    setIsUppercasing(true);

    const greetings = ['Hello World', 'yo', `what's up?`];
    const textToUppercase = greetings[Math.floor(Math.random() * greetings.length)];
    const { data: capitalizedText } = await capitalizeTextRemoteFunction({ text: textToUppercase });
    setText(capitalizedText);

    setIsUppercasing(false);
  }

  return (
    <>
      <WideButton label="Uppercase some text" onClick={handleButtonClick} />
      {isUppercasing ? <LoadingSpinner /> : <span>{uppercasedText}</span>}
    </>
  );
}

export function Functions() {
  const app = useFirebaseApp();

  return (
    <FunctionsProvider sdk={getFunctions(app)}>
      <CardSection title="Call a cloud function">
        <UpperCaser />
      </CardSection>
    </FunctionsProvider>
  );
}
