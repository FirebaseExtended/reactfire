SHORT_SHA=$(git rev-parse --short $GITHUB_SHA)
TAG_TEST="^refs/tags/v.+$"
LATEST_TEST="^[^-]*$"

if [[ $GITHUB_REF =~ $TAG_TEST ]]; then
    OVERRIDE_VERSION=${GITHUB_REF/refs\/tags\/v/}
    if [[ $NPM_VERSION =~ $LATEST_TEST ]]; then
        NPM_TAG=latest
    else
        NPM_TAG=next
    fi;
else
    OVERRIDE_VERSION=$(node -e "console.log(require('./package.json').version)")-canary.$SHORT_SHA
    NPM_TAG=canary
fi;

npm --no-git-tag-version --allow-same-version -f version $OVERRIDE_VERSION
yarn build &&
    mv $(npm pack . | tail -n 1) reactfire.tgz &&
    echo "npm publish ./reactfire-$GITHUB_RUN_ID/reactfire.tgz --tag $NPM_TAG" > ./publish.sh &&
    chmod +x ./publish.sh
