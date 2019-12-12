#!/bin/bash

docker ps
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker tag offcial-app:${TRAVIS_COMMIT} plar/offcial-app:${TRAVIS_COMMIT}
docker push plar/offcial-app:${TRAVIS_COMMIT}
docker build --no-cache -t offcial-app:latest .
docker tag offcial-app:latest plar/offcial-app:latest
docker push plar/offcial-app:latest
