SHORT_SHA=$(git rev-parse --short $GITHUB_SHA)
TAG_TEST="^refs/tags/v.+$"
LATEST_TEST="^[^-]*$"

if [[ $GITHUB_REF =~ $TAG_TEST ]]; then
    OVERRIDE_VERSION=${GITHUB_REF/refs\/tags\/v/}
    if [[ $OVERRIDE_VERSION =~ $LATEST_TEST ]]; then
        NPM_TAG=latest
    else
        NPM_TAG=next
    fi;
else
    OVERRIDE_VERSION=$(node -e "console.log(require('./package.json').version)")-exp.$SHORT_SHA
    NPM_TAG=exp
fi;

npm --no-git-tag-version --allow-same-version -f version $OVERRIDE_VERSION
yarn build
TARBALL=$(npm pack . | tail -n 1)
mv $TARBALL reactfire.tgz

echo "npm publish \$(dirname \"\$0\")/reactfire.tgz --tag $NPM_TAG" > ./publish.sh
chmod +x ./publish.sh

echo "tar -xzvf \$(dirname \"\$0\")/reactfire.tgz && rsync -a package/ ./" > ./unpack.sh
chmod +x ./unpack.sh
