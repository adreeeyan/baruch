#!/bin/bash -v

set -e

# Custom keychain
KEY_CHAIN=ios-build.keychain
KEY_CHAIN_PASSWORD=travis

# Set working directory
CWD=$(pwd)
cd "$(dirname "$0")"

# Create a custom keychain
security create-keychain -p $KEY_CHAIN_PASSWORD $KEY_CHAIN

# Unlock the keychain
security unlock-keychain -p $KEY_CHAIN_PASSWORD $KEY_CHAIN

# Set keychain timeout to 1 hour for long builds
# see http://www.egeek.me/2013/02/23/jenkins-and-xcode-user-interaction-is-not-allowed/
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# Set keychain search list
security list-keychains -s $KEY_CHAIN

# Make the custom keychain default, so xcodebuild will use it for signing
security default-keychain -s $KEY_CHAIN

# Add certificates to keychain and allow codesign to access them
security import apple-wwdcrca.cer -k $KEY_CHAIN -T /usr/bin/codesign

# Restore working directory
cd -

