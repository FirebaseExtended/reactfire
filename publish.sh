cd reactfire/pub/reactfire

if test $NPM_TOKEN; then

    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

    cp ../../../README.md .
    cp -r ../../../docs .
    cp ../../../LICENSE .

    if test $TAG_NAME; then
        npm version $(echo $TAG_NAME | sed 's/^v\(.*\)$/\1/')
        npm publish . --tag next
        ret=$?
    else
        npm version $(npm version | sed -n "s/^  reactfire: '\(.*\)',/\1/p")-canary.$SHORT_SHA
        npm publish . --tag canary
        ret=$?
    fi

    rm -f .npmrc

fi

exit $ret