#!/bin/bash -v

set -e

# Build Ionic App for Android
cordova platform add android@6.3.0

echo "Building apk..."
if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    ionic cordova build android
else
    ionic cordova build android --prod --release
fi
