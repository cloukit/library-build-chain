# Development

-----

&nbsp;

### Module Format - FESM

Each library comes as an tree-shakeable and AOT enabled flat ES2015 Module.
See [YouTube Packaging Angular - Jason Aden - ng-conf 2017]()https://www.youtube.com/watch?v=unICbsPGFIA) for in depth explanation.

-----

&nbsp;

### Metadata for each Library

The library itself has `package.json` containing:

```json
{
  "name": "@cloukit/multi-select",
  "moduleId": "multi-select",
  "version": "1.1.0",
  "dependencies": {

  },
  "devDependencies": {
    "@cloukit/library-build-chain": "1.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^4.0.1",
    "rxjs": "^5.3.0",
    "zone.js": "^0.8.5"
  }
}
```

which will then be transformed into `./dist/package.json`:

```json
{
  "name": "@cloukit/multi-select",
  "author": "codeclou.io",
  "version": "1.1.0",
  "license": "MIT",
  "module": "cloukit-multi-select.es5.js",
  "es2015": "cloukit-multi-select.js",
  "typings": "cloukit-multi-select.d.ts",
  "dependencies": {

  },
  "devDependencies": {
    "@cloukit/library-build-chain": "1.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^4.0.1",
    "rxjs": "^5.3.0",
    "zone.js": "^0.8.5"
  }
}
```

-----

&nbsp;

### Building a Library and Publishing to npmjs.com

Goto the component dir containing `package.json` and execute:

```bash
yarn
yarn build
```

Now there will be a `./dist/` directory containing everything that can now be published to npmjs.com

:bangbang: Publishing is done by `jenkins.sh` via Jenkins on TAG-Job run.

Therefore tag you library like so

```bash
git tag -a 1.0.2 -m "1.0.2"
git push origin 1.0.2
```

-----

&nbsp;

### Setup for a Library

  * (1) Create `package.json`
  * (2) Copy `.gitignore` from `@cloukit/toggle`
    * see example: https://github.com/cloukit/toggle/blob/master/.gitignore
  * (3) Main file with exports is expected to be `../src/index.ts`
    * see example: https://github.com/cloukit/toggle
  * (4) place `jenkins.sh` at root
    * see example: https://github.com/cloukit/toggle/blob/master/jenkins.sh
  * (5) add Webhook to codeclou.io jenkins
  * (6) Create Jenkins Job for project with convention "cloukit---COMPONENTNAME"

-----


&nbsp;

### Howto Link Lib during Development

(1) Go to component project and type to build the component

```
cd toggle
yarn
```

(2) Now `dist/` folder appeared:

```
cd dist/
yarn link
```

(3) Link into project


```
cd my-other-component
yarn link @cloukit/toggle
```

(4) Now you should be able to do in your testproject

```typescript
import { FooModule } from '@cloukit/toggle';
```

-----

&nbsp;

### Jenkins Job Setup

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
