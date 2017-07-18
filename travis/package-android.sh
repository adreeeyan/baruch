#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    echo "Skipping package Android for develop branch"
    exit
fi

mkdir -p output
cp platforms/android/build/outputs/apk/android-release-unsigned.apk output/baruch-release-unsigned.apk

#sign the apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks -storepass $1 output/baruch-release-unsigned.apk adrianonrails
"${ANDROID_HOME}/build-tools/26.0.0/zipalign" -v 4 output/baruch-release-unsigned.apk output/Baruch.apk