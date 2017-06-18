#!/bin/bash

#
# BUILD TRIGGERED BY: https://github.com/codeclou/jenkins-github-webhook-build-trigger-plugin
#

set -e

mkdir ../build-results
chmod 777 ../build-results

#
# ONLY BUILD MASTER BRANCH AND TAGS
#
echo "GWBT_TAG: $GWBT_TAG"
echo "GWBT_BRANCH: $GWBT_BRANCH"
if [[ "${GWBT_BRANCH}" != "master" ]]
then
  if [[ -z "$GWBT_TAG" ]]
  then
    echo "BRANCH DETECTED. NOT MASTER! EXIT!"
    exit 0
  else
  	echo "TAG DETECTED. CONTINUE"
  fi
else
  echo "BRANCH DETECTED. IS MASTER! CONTINUE!"
fi

#
# RUN DOCKERIZED BUILD
#
docker run \
    --tty \
    -e GITHUB_AUTH_USER=$GITHUB_AUTH_USER \
    -e GITHUB_AUTH_TOKEN=$GITHUB_AUTH_TOKEN \
    -e GWBT_COMMIT_BEFORE=$GWBT_COMMIT_BEFORE \
    -e GWBT_COMMIT_AFTER=$GWBT_COMMIT_AFTER \
    -e GWBT_REF=$GWBT_REF \
    -e GWBT_TAG=$GWBT_TAG \
    -e GWBT_BRANCH=$GWBT_BRANCH \
    -e GWBT_REPO_CLONE_URL=$GWBT_REPO_CLONE_URL \
    -e GWBT_REPO_HTML_URL=$GWBT_REPO_HTML_URL \
    -e GWBT_REPO_FULL_NAME=$GWBT_REPO_FULL_NAME \
    -e GWBT_REPO_NAME=$GWBT_REPO_NAME \
    --volume $WORKSPACE:/work \
    codeclou/docker-nodejs:7.5.0 \
    bash /work/library-build-chain/jenkins-inside-docker.sh
