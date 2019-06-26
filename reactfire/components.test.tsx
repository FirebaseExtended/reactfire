import { of, Subject, Observable, observable } from 'rxjs';
import { render, waitForElement, cleanup } from '@testing-library/react';
import * as React from 'react';
import 'jest-dom/extend-expect';

const mockTrace = {
  start: jest.fn(),
  stop: jest.fn()
};

const mockPerf = {
  trace: jest.fn(() => mockTrace)
};

const mockFirebase = {
  performance: jest.fn(() => mockPerf)
};

describe('SuspenseWithPerf', () => {
  afterEach(cleanup);

  test.todo(
    'renders the same as Suspense (fallback until children stop throwing a promise)'
  );

  test.todo('creates a trace with the correct name');

  test.todo('starts a trace when it first renders');

  test.todo('stops the trace when it renders children');

  test.todo('can find fireperf from Context');

  test.todo('can use firePerf from props');
});

describe('AuthCheck', () => {
  afterEach(cleanup);

  test.todo('can find firebase Auth from Context');

  test.todo('can use firebase Auth from props');

  test.todo('renders the fallback if a user is not signed in');

  test.todo('renders children if a user is logged in');

  test.todo('checks requiredClaims');
});
