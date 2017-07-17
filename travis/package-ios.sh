#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    echo "Skipping package iOS for develop branch"
    exit
fi

mkdir -p output
tar zcvf output/baruch-release-unsigned.app.tgz platforms/ios/build/emulator/Baruch.app

