SHORT_SHA=$(git rev-parse --short $GITHUB_SHA)
TAG_TEST="^refs/tags/v.+$"

if [[ $GITHUB_REF =~ $TAG_TEST ]]; then
    OVERRIDE_VERSION=${GITHUB_REF/refs\/tags\/v/}
else
    OVERRIDE_VERSION=$(npm version | sed -n "s/. reactfire: '\(.*\)',/\1/p")-canary.$SHORT_SHA
fi;

npm --no-git-tag-version --allow-same-version -f version $OVERRIDE_VERSION
yarn build && mv $(npm pack . | tail -n 1) reactfire.tgz