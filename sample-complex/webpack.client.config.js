const baseConfig = require('./webpack.config');
const path = require('path');

module.exports = {
  entry: './containers/ClientApp.js',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, '../public/assets')
  },
  ...baseConfig
};
