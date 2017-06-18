#!/bin/bash

#
# BUILD TRIGGERED BY: https://github.com/codeclou/jenkins-github-webhook-build-trigger-plugin
#

set -e

mkdir build-results
chmod 777 build-results

#
# ONLY BUILD MASTER BRANCH AND TAGS
#
if [[ "${GWBT_BRANCH}" != "master" ]]
then
  if [ -z "$GWBT_TAG" ]
  then
    echo "TAG DETECTED. CONTINUE"
    exit 0
  else
  	echo "BRANCH DETECTED. NOT MASTER! EXIT!"
    exit 0
  fi
  echo "BRANCH DETECTED. IS MASTER! CONTINUE!"
fi

#
# BUILD SCRIPT - RUNS INSIDE DOCKER
#
cat <<EOF > jenkins--inside-docker.sh
#!/bin/bash
set -e
cp -r /work/* /work-private/
cp -r /work/.gitignore /work-private/
rm -f /work-private/package-lock.json || true
cd /work-private
npm install
npm run build
#sed -i "s/___COMMIT___/$GWBT_COMMIT_AFTER/" ./src/app/app.component.ts
#sed -i "s/___BUILDSTAMP___/${BUILD_ID}/" ./src/app/app.component.ts
cd /work-private/dist
ls -lah
# Create zip without .git but with e.g. .htaccess
if [ -d ".git" ]; then rm -rf .git; fi
zip -r dist.zip *
mv dist.zip /work/build-results/
chmod 777 /work/build-results/dist.zip
ls -lah
cd /work-private/


EOF

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
    bash /work/library-build-chain/jenkins--inside-docker.sh
