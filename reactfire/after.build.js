const fs = require('fs');
const path = require('path');
const { version } = require('./package.json');

// This script should only ever be ran after
// a successful rollup build.

const ABSOLUTE_PATH = path.join(process.cwd(), `/pub/reactfire`);

const files = [{
  name: 'firebaseApp/index.js',
  token: '::__reactfireversion__::',
  replaceValue: version
}];

const fileContents = files.map(file => {
  const fullPath = path.join(ABSOULTE_PATH, file.name);
  const content = fs.readFileSync(fullPath, 'utf8');
  return { 
    fullPath,
    content,
    ...file,
  };
})

fileContents.forEach(file => {
  const replaced = file.content.replace(file.token, file.replaceValue);
  fs.writeFileSync(file.fullPath, replaced, 'utf8');
});
