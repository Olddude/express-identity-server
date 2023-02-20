#!/usr/bin/env sh

yarn clean
docker-compose -f ./infrastructure/docker-compose.yml --rmi all down
docker image rm stuff --force
docker image prune --force
docker container prune --force

tree . -I node_modules

docker-compose -f ./infrastructure/docker-compose.yml up
