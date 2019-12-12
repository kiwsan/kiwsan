#!/bin/bash

openssl aes-256-cbc -K $encrypted_4d5e503578b4_key -iv $encrypted_4d5e503578b4_iv -in travis_rsa.enc -out travis_rsa -d

chmod 600 travis_rsa
mv travis_rsa ~/.ssh/travis_rsa
