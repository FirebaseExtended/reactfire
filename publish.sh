LATEST_TEST="^[^-]*$"
CANARY_TEST="-canary."

NPM_VERSION=$(npm version | sed -n "s/. reactfire: '\(.*\)',/\1/p")

if [[ $NPM_VERSION =~ $LATEST_TEST ]]; then
    NPM_TAG=latest
elif [[ $NPM_VERSION =~ $CANARY_TEST ]]; then
    NPM_TAG=canary
else
    NPM_TAG=next
fi;

npm publish reactfire-$GITHUB_RUN_ID/reactfire.tgz --tag $NPM_TAG