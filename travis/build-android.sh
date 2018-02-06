#!/bin/bash -v

set -e

# Build Ionic App for Android
ionic cordova platforms add android@6.3.0 --save

echo "Building apk..."
if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    ionic cordova build android
else
    ionic cordova build android --prod --release
fi
