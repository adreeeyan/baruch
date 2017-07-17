#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    echo "Skipping package Android for develop branch"
    exit
fi

mkdir -p output
cp platforms/android/build/outputs/apk/android-release-unsigned.apk output/baruch-release-unsigned.apk

