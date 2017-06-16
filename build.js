#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const shell = require('shelljs');
const fs = require('fs');
const NGC_BINARY='../library-build-chain/node_modules/.bin/ngc';
const ROLLUP_BINARY='../library-build-chain/node_modules/.bin/rollup';
const tsconfigTemplate = require('./build-tsconfig-template.js');
const packageJsonTemplate = require('./build-package-json-template.js');

//
// CLEANUP COPY SRC CONTENTS TO BUILD
//
shell.rm('-rf', '../build/');
shell.rm('-rf', '../dist/');
shell.mkdir('../build/');
shell.cp('-R', '../src', '../build/');
shell.cp('-R', '../manifest.json', '../build/');
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
fs.writeFileSync(`${currentDir}/tsconfig-es5.json`, JSON.stringify(tsConfigES5, null, 2));
fs.writeFileSync(`${currentDir}/tsconfig-es2015.json`, JSON.stringify(tsConfigES2015, null, 2));

//
// GENERATE TEMPORARY LIBRARY package.json TO INSTALL PEER DEPENDENCIES DURING BUILD
//
let packageJson = packageJsonTemplate.generate(manifest.moduleId, manifest.version, 'dependencies', manifest.peerDependencies);
fs.writeFileSync(`${currentDir}/package.json`, JSON.stringify(packageJson, null, 2));
shell.exec('npm install');
shell.exec(`${NGC_BINARY} -p tsconfig-es5.json`);
shell.exec(`${NGC_BINARY} -p tsconfig-es2015.json`);
shell.exec(`${ROLLUP_BINARY} _es5/src/${manifest.moduleId}.js -o ../dist/${manifest.moduleId}.es5.js`);
shell.exec(`${ROLLUP_BINARY} _es2015/src/${manifest.moduleId}.js -o ../dist/${manifest.moduleId}.es2015.js`);

//
// WRITE FINAL LIB package.json
//
packageJson = packageJsonTemplate.generate(manifest.moduleId, manifest.version, 'peerDependencies', manifest.peerDependencies);
fs.writeFileSync(`../dist/package.json`, JSON.stringify(packageJson, null, 2));

//
// COPY METADATA FILE FOR TREE SHAKING
//
shell.cp(`_es2015/${manifest.moduleId}.metadata.json`, `../dist/${manifest.moduleId}.metadata.json`);

//
// FIXME: SINCE WE CANNOT CREATE A TS-BUNDLE FILES WE NEED TO COPY ALL *.d.ts FILES MANUALLY TO DIST
//


//
// CLEANUP _es5 AND _es2015 dir
//
//find('.').filter(function(file) { return file.match(/\.ts$/); });

/*
# Run Angular Compiler
$NGC -p src/tsconfig-build.json
# Rollup simple-ui-lib.js
$ROLLUP build/simple-ui-lib.js -o dist/simple-ui-lib.js

# Repeat the process for es5 version
$NGC -p src/tsconfig-es5.json

# Copy non-js files from build
rsync -a --exclude=*.js build/ dist

# Copy library package.json and README.md
cp src/package.json dist/package.json
cp README.md dist/README.md
*/
