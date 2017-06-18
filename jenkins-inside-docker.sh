#!/bin/bash

#
# NOTE: ALL ENV-VARS MUST BE SET VIA -e ON DOCKER RUN!
#

set -e

#
# COPY FILES INTO CONTAINERS WORK DIR
#
cp -r /work/* /work-private/
cp -r /work/.gitignore /work-private/
rm -f /work-private/package-lock.json || true

#
# BUILD
#
cd /work-private/library-build-chain/
npm install
npm run build
#sed -i "s/___COMMIT___/$GWBT_COMMIT_AFTER/" ./src/app/app.component.ts
#sed -i "s/___BUILDSTAMP___/${BUILD_ID}/" ./src/app/app.component.ts

#
# PRE-PUBLISH
#
cd /work-private/dist
ls -lah
# Create zip without .git but with e.g. .htaccess (would need to be added manually)
if [ -d ".git" ]; then rm -rf .git; fi
zip -r dist.zip *
mv dist.zip /work/build-results/
chmod 777 /work/build-results/dist.zip
ls -lah
cd /work-private/

#
# PUBLISH
#
if [ -z "$GWBT_TAG" ]
then
  echo "TAG DETECTED. CONTINUE PUBLISH!"
  exit 0
else
  echo "NO TAG DETECTED. NO PUBLISH! EXIT!"
  exit 0
fi

#
# PUBLISH dist.zip TO GITHUB.COM RELEASE
#

# TODO

#
# PUBLISH dist/* TO NPMJS.COM
#

# TODO
