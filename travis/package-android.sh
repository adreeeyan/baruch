#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    echo "Skipping package Android for develop branch"
    exit
fi

echo "Packaging your app..."

mkdir -p output
cp platforms/android/build/outputs/apk/android-release-unsigned.apk output/baruch-release-unsigned.apk

echo "Signing the apk"
#sign the apk
export zippath="$(find $ANDROID_HOME -name zipalign -print -quit)"
echo $zippath
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks -storepass $1 output/baruch-release-unsigned.apk adrianonrails
$zippath -v 4 output/baruch-release-unsigned.apk output/Baruch.apk

echo "Deleting the unsigned apk"
#remove the unsigned
rm output/baruch-release-unsigned.apk