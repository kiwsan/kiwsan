#!/bin/bash

docker build -t offcial-app:${TRAVIS_COMMIT} .
docker run -d -p 127.0.0.1:8000:8000 offcial-app:${TRAVIS_COMMIT}
