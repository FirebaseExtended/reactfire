const { version: reactFireVersion } = require('./package.json');

module.exports = {
  plugins: [
    [
      'minify-replace',
      {
        replacements: [
          {
            identifierName: '__REACTFIRE_VERSION__',
            replacement: {
              type: 'stringLiteral',
              value: reactFireVersion + ''
            }
          }
        ]
      }
    ]
  ]
};
