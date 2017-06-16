#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
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
shell.cp(`_es2015/src/${manifest.moduleId}.metadata.json`, `../dist/${manifest.moduleId}.metadata.json`);

//
// COPY README
//
shell.cp(`../README.md`, `../dist/`);

//
// FIXME: SINCE WE CANNOT CREATE A TS-BUNDLE FILES WE NEED TO COPY ALL *.d.ts FILES MANUALLY TO DIST
//
const allTypeDefinitionFiles = shell.find('_es2015/src/').filter(file => file.match(/\.d.ts$/));
for (let i=0; i<allTypeDefinitionFiles.length; i++) {
  const currentFile = allTypeDefinitionFiles[i];
  const currentFilePath = path.dirname(currentFile);
  const targetFilePath = currentFilePath.replace(/^_es2015\/src[/]?/, '../dist/');
  shell.echo(currentFilePath);
  if (!shell.test('-d', targetFilePath)) {
    shell.mkdir('-p', targetFilePath);
  };
  shell.cp(currentFile, targetFilePath);
}
