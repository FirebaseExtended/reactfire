LATEST_TEST="^[^-]*$"
SHORT_SHA=$(git rev-parse --short $GITHUB_SHA)
TAG_TEST="^refs/tags/v.+$"

if [[ $GITHUB_REF =~ $TAG_TEST ]]; then
    OVERRIDE_VERSION=${GITHUB_REF/refs\/tags\/v/}
    if [[ $OVERRIDE_VERSION =~ $LATEST_TEST ]]; then
        NPM_TAG=latest
    else
        NPM_TAG=next
    fi;
else
    OVERRIDE_VERSION=$(npm version | sed -n "s/. reactfire: '\(.*\)',/\1/p")-canary.$SHORT_SHA
    NPM_TAG=canary
fi;

npm --no-git-tag-version --allow-same-version -f version $OVERRIDE_VERSION
npm publish . --tag $NPM_TAG