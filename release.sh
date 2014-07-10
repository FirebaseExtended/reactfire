#!/bin/bash

STANDALONE_DEST="../firebase-clients/libs/reactfire"
STANDALONE_STUB="reactfire"

# Ensure the firebase-clients repo is at the correct relative path
if [[ ! -d $STANDALONE_DEST ]]; then
  echo "Eror: Destination directory not found; 'firebase-clients' needs to be a sibling of this repo."
  exit 1
fi

# Get the version we are releasing
PARSED_CLIENT_VERSION=$(head -5 dist/reactfire.js | tail -1 | awk -F ' ' '{print $3}')

# Ensure this is the correct version number
read -p "What version of ReactFire are we releasing? ($PARSED_CLIENT_VERSION) " VERSION
if [[ -z $VERSION ]]; then
  VERSION=$PARSED_CLIENT_VERSION
fi
echo

# Ensure the changelog has been updated for the newest version
CHANGELOG_VERSION="$(head -1 CHANGELOG.md | awk -F 'v' '{print $2}')"
if [[ $VERSION != $CHANGELOG_VERSION ]]; then
  echo "Error: Most recent version in changelog (${CHANGELOG_VERSION}) does not match version you are releasing (${VERSION})."
  exit 1
fi

# Ensure the README has been updated for the newest version
README_VERSION="$(grep '<script src=\"https://cdn.firebase.com/libs/reactfire/' README.md | awk -F '/' '{print $6}')"
if [[ $VERSION != $README_VERSION ]]; then
  echo "Error: Script tag version in README (${README_VERSION}) does not match version you are releasing (${VERSION})."
  exit 1
fi

# Ensure the version number in the package.json is correct
NPM_VERSION=$(grep "version" package.json | head -1 | awk -F '"' '{print $4}')
if [[ $VERSION != $NPM_VERSION ]]; then
  echo "Error: npm version specified in package.json (${NPM_VERSION}) does not match version you are releasing (${VERSION})."
  exit 1
fi

# Ensure the version number in the bower.json is correct
BOWER_VERSION=$(grep "version" bower.json | head -1 | awk -F '"' '{print $4}')
if [[ $VERSION != $BOWER_VERSION ]]; then
  echo "Error: Bower version specified in bower.json (${BOWER_VERSION}) does not match version you are releasing (${VERSION})."
  exit 1
fi

# Create a new git tag if they have not already done so
LAST_GIT_TAG="$(git tag --list | tail -1 | awk -F 'v' '{print $2}')"
if [[ $VERSION != $LAST_GIT_TAG ]]; then
  git tag v$VERSION
  git push --tags

  echo "*** Last commit tagged as v${VERSION} ***"
  echo
else
  echo "*** Git tag v${VERSION} already created ***"
  echo
fi

# Changing the git tag publishes the new version to Bower automatically
echo "*** v${VERSION} of reactfire published to Bower ***"
echo

# Publish the new version to npm
# TODO: what if this fails?
npm publish

echo "*** v${VERSION} of reactfire published to npm ***"
echo

# Check if we already have this as a standalone
STANDALONE_TARGET_DIR="${STANDALONE_DEST}/${VERSION}/"
if [[ -e ${STANDALONE_TARGET_DIR} ]]; then
  echo "Error: The target directory already exists: ${STANDALONE_TARGET_DIR}."
  exit 1
fi

# Make the target directory
mkdir $STANDALONE_TARGET_DIR

# Copy the files to the target directory
cp dist/$STANDALONE_STUB.js $STANDALONE_TARGET_DIR
cp dist/$STANDALONE_STUB.min.js $STANDALONE_TARGET_DIR

echo "*** Debug and non-debug versions of ReactFire copied to firebase-clients ***"
echo

# Overwrite the existing changelog
cp CHANGELOG.md $STANDALONE_DEST/changelog.txt

echo "*** ReactFire changelog copied to firebase-clients ***"
echo

# Go to the firebase-clients repo
cd ${STANDALONE_DEST}/

# Make sure the checked-out firebase-clients branch is master
FIREBASE_CLIENTS_BRANCH="$(git branch | grep "*" | awk -F ' ' '{print $2}')"
if [[ $FIREBASE_CLIENTS_BRANCH != "master" ]]; then
  echo "Error: Your firebase-clients repo is not on the master branch. You will need to push the new files to it manually."
  exit 1
fi

# Pull any changes to the firebase-clients repo
git pull origin master
if [[ $? -ne 0 ]]; then
  echo "Error pulling firebase-clients repo."
  exit 1
fi

# Commit to the firebase-clients repo
git add .
git commit -am "[firebase-release] Updated Firebase $DESCRIPTION to $VERSION"

# Push the new files to the firebase-clients repo
git push origin master
if [[ $? -ne 0 ]]; then
  echo "Error pushing firebase-clients repo."
  exit 1
fi
echo

echo "*** Changes pushed to firebase-client ***"
echo

# Go back to starting directory
cd -

echo
echo "Manual steps remaining:"
echo "  1) Deploy firebase-clients to CDN via Jenkins"
echo "  2) Update the release notes for ReactFire version ${VERSION} on GitHub"
echo "  3) Update all ReactFire client version numbers specified in firebase-website to ${VERSION}"
echo "  4) Tweet @FirebaseRelease: 'v${VERSION} of ReactFire is available https://cdn.firebase.com/libs/reactfire/$VERSION/reactfire.min.js Changelog: https://cdn.firebase.com/libs/reactfire/changelog.txt'"
echo
echo "Done! Woot!"
echo