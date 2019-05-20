echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

cp ../README.md .
cp ../LICENSE .

if test $TAG_NAME; then
    npm version $(echo $TAG_NAME | sed 's/^v\(.*\)$/\1/')
    npm publish . --tag next
else
    npm version $(npm version | head -n 1 |  sed "s/^.*: '\([^']*\).*/\1/")-canary.$SHORT_SHA
    npm publish . --tag canary
fi

rm -f .npmrc