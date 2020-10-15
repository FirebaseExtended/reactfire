import '@testing-library/jest-dom';

// @ts-ignore: globalThis is supposed to be read-only?
global.globalThis = require('globalthis')();
