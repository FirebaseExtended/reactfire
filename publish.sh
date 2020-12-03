LATEST_TEST="^[^-]*$"
CANARY_TEST="-canary."

NPM_VERSION=$(npm view ./reactfire-$GITHUB_RUN_ID/reactfire.tgz version)

if [[ $NPM_VERSION =~ $LATEST_TEST ]]; then
    NPM_TAG=latest
elif [[ $NPM_VERSION =~ $CANARY_TEST ]]; then
    NPM_TAG=canary
else
    # TODO once we hit 3.0.0 move this back to next
    NPM_TAG=latest
fi;

echo "Publishing to NPM @$NPM_TAG"
npm publish ./reactfire-$GITHUB_RUN_ID/reactfire.tgz --tag $NPM_TAG
