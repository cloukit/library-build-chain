#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const shell = require('shelljs');
const fs = require('fs');
const NGC_BINARY='../build-chain/node_modules/.bin/ngc';
const ROLLUP_BINARY='../build-chain/node_modules/.bin/rollup';
const tsconfigTemplate = require('./build-tsconfig-template.js');
const packageJsonTemplate = require('./build-tsconfig-template.js');

//
// CLEANUP COPY SRC CONTENTS TO BUILD
//
shell.rm('-rf', '../build/');
shell.rm('-rf', '../dist/');
shell.mkdir('../build/');
shell.cp('-R', '../src', '../build/');
shell.cd('../build');

//
// READ MANIFEST
//
const manifest = JSON.parse(shell.cat('manifest.json'));

//
// WRITE TSCONFIGS
//
const tsConfigES5 = tsconfigTemplate.generate('es5', manifest.moduleId);
const tsConfigES2015 = tsconfigTemplate.generate('es2015', manifest.moduleId);
const currentDir = shell.pwd();
fs.writeFileSync(`${currentDir}/tsconfig-es5.json`, tsConfigES5);
fs.writeFileSync(`${currentDir}/tsconfig-es2015.json`, tsConfigES2015);

/*
# Run Angular Compiler
$NGC -p src/tsconfig-build.json
# Rollup simple-ui-lib.js
$ROLLUP build/simple-ui-lib.js -o dist/simple-ui-lib.js

# Repeat the process for es5 version
$NGC -p src/tsconfig-es5.json
$ROLLUP build/simple-ui-lib.js -o dist/simple-ui-lib.es5.js

# Copy non-js files from build
rsync -a --exclude=*.js build/ dist

# Copy library package.json and README.md
cp src/package.json dist/package.json
cp README.md dist/README.md



shell.exec(`${NGC_BINARY} -p tsconfig-es5.json`);
*/
