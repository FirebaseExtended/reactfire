const baseConfig = require('./webpack.config');
const path = require('path');

// Note that since this is for the server, it is important to
// set the target to node and set the libraryTarget to commonjs2
module.exports = {
  // target: 'node',
  entry: './server.js',
  output: {
    filename: 'server.bundle.js'
  },
  ...baseConfig
};
