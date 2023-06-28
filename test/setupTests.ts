import '@testing-library/jest-dom';
import fetch from 'cross-fetch';
const dns = require('node:dns');

// polyfill for older versions of node
global.fetch = fetch;

// The emulator suite fails in CI, only on Node 18.
// This apparently fixes it.
// https://github.com/firebase/firebase-tools/issues/5755#issuecomment-1535445383
dns.setDefaultResultOrder('ipv4first')
