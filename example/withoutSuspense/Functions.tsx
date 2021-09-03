import 'firebase/storage';
import * as React from 'react';
import { useState } from 'react';
import { useFirebaseApp, FunctionsProvider, useFunctions } from 'reactfire';
import { CardSection } from '../display/Card';
import { LoadingSpinner } from '../display/LoadingSpinner';
import { AuthWrapper } from './Auth';
import {getFunctions, httpsCallable} from 'firebase/functions';


function Calculator() {
  const functions = useFunctions();
  const remoteCalculator = httpsCallable<{firstNumber: number, secondNumber: number, operator: '+'}, number>(functions 'calculate');

  const [calculationResult, setResult] = useState<null | number>(null);

  async function handleButtonClick(firstNumber, secondNumber, operator) {
    const remoteCalculatorResponse = await remoteCalculator({ firstNumber, secondNumber, operator });

    setResult(remoteCalculatorResponse.data);
  }

  if (!calculationResult) {
    return <button onClick={() => handleButtonClick(1, 2, '+')}>Click me to add 1 + 2</button>;
  } else {
    return <pre>{calculationResult}</pre>;
  }
}

export function Functions() {
  const app = useFirebaseApp();

  return (
    <FunctionsProvider sdk={getFunctions(app)}>
      <CardSection title="Call a cloud function">
        <Calculator />
      </CardSection>
    </FunctionsProvider>
  );
}
