cd reactfire/pub/reactfire

# TODO once we go 2.0.0 stable, uncomment
# LATEST_TEST="^[^-]*$"

# Publish -rc tags on @latest for now
LATEST_TEST="^[^-]*-rc"

if test $NPM_TOKEN; then

    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

    cp ../../../README.md .
    cp -r ../../../docs .
    cp ../../../LICENSE .

    if test $TAG_NAME; then
        npm version $(echo $TAG_NAME | sed 's/^v\(.*\)$/\1/')

        if [[ $TAG_NAME =~ $LATEST_TEST ]]; then
            NPM_TAG=latest
        else
            NPM_TAG=next
        fi

        npm publish . --tag $NPM_TAG
        ret=$?
    else
        npm version $(npm version | sed -n "s/. reactfire: '\(.*\)',/\1/p")-canary.$SHORT_SHA
        npm publish . --tag canary
        ret=$?
    fi

    rm -f .npmrc

fi

exit $ret