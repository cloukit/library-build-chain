#!/bin/bash

# BUILD TRIGGERED BY: https://github.com/codeclou/jenkins-github-webhook-build-trigger-plugin
set -e
git clone https://github.com/cloukit/library-deploy-chain.git library-deploy-chain
cd library-deploy-chain
bash jenkins.sh
