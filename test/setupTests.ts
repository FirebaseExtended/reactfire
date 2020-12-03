import '@testing-library/jest-dom';

// @ts-ignore
global['globalThis'] = window['globalThis'] = require('globalthis/polyfill')();
