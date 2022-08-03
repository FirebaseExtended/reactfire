import '@testing-library/jest-dom';
import fetch from 'cross-fetch';

// polyfill for older versions of node
global.fetch = fetch;
