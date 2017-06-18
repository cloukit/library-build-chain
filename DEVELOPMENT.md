# Development


**Build**

See: https://github.com/cloukit/library-build-chain

&nbsp;

## Howto Link Lib during Development

(1) Go to component project and type to build the component

```
git clone https://github.com/cloukit/ng-library-build.git library-build-chain
cd library-build-chain
npm install
npm run build
cd ../
# symlink node_modules
ln -s build/node_modules
```

(2) Now `dist/` folder appeared:

```
cd dist/
npm link
```

(3) Link into project 

see: https://docs.npmjs.com/cli/link

```
cd my-test-project
npm link @cloukit/foo  # with foo = component name
```

(4) Now you should be able to do in your testproject

```typescript
import { FooModule } from '@cloukit/foo';
```

&nbsp;

## Jenkins Job Setup

JobTrigger via Webhook and ANSI Colors plugin active:

```bash
#!/bin/bash
 
set -e
 
# ############################################################################# #
# And: https://github.com/codeclou/jenkins-github-webhook-build-trigger-plugin  #
# ############################################################################# #
#
# ENV VARS
#
# $GITHUB_AUTH_TOKEN is exported globally in Jenkins Configuration

#
# Cleanup before run
#
rm -rf $WORKSPACE/.[^.] .??* || true # Delete hidden files
rm -rf $WORKSPACE/* || true          # Delete normal files
cd $WORKSPACE

#
# Prevent manual Job starts
#
if [[ -z "$GWBT_COMMIT_AFTER" ]]
then
    echo "I DON'T WANT JOBS STARTED MANUALLY! ONLY VIA GITHUB WEBHOOK!"
    exit 1
fi


#
# CLONE AND BUILD - Since either TAG or BRANCH is empty, this will clone all tags and branches
#
git clone --single-branch \
          --branch ${GWBT_BRANCH}${GWBT_TAG} \
          https://${GITHUB_AUTH_TOKEN}@github.com/${GWBT_REPO_FULL_NAME}.git .
git reset --hard $GWBT_COMMIT_AFTER

#
# JENKINS.SH
#
if [ -f jenkins.sh ]
then
  bash jenkins.sh
else
  echo "no jenkins.sh => no build :)"
fi
```
