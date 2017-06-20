#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const Gaze = require('gaze').Gaze;
const argv = require('yargs').argv
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

/**
 * Build the package to dist
 * @param languageTarget {string} either 'es5' or 'es2015'
 * @param watch {boolean}
 */
const buildPackage = (languageTarget, watch) => {
  //
  // WRITE TSCONFIGS
  //
  const tsConfig = tsconfigTemplate.generate(languageTarget, manifest.moduleId);
  const currentDir = shell.pwd();
  fs.writeFileSync(`${currentDir}/tsconfig-${languageTarget}.json`, JSON.stringify(tsConfig, null, 2));
  //
  // GENERATE TEMPORARY LIBRARY package.json TO INSTALL PEER DEPENDENCIES DURING BUILD
  //
  if (!watch) {
    let packageJson = packageJsonTemplate.generate(manifest.moduleId, manifest.version, 'dependencies', manifest.peerDependencies);
    fs.writeFileSync(`${currentDir}/package.json`, JSON.stringify(packageJson, null, 2));
    shell.exec('npm install');
  }

  //
  // BUILD WITH ANGULAR COMPILER
  //
  shell.exec(`${NGC_BINARY} -p tsconfig-${languageTarget}.json`);

  //
  // BUILD FLAT ONE FILE MODULE WITH ROLLUP
  //
  shell.exec(`${ROLLUP_BINARY} _${languageTarget}/src/${manifest.moduleId}.js -o ../dist/${manifest.moduleId}.${languageTarget}.js`);

  // ====================
  // DO ONLY ONCE FROM HERE
  if (languageTarget === 'es5') return;
  // ====================

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
  // FIXME: SINCE WE CANNOT CREATE A TYPE-DEFINITION-BUNDLE FILE (YET) WE NEED TO COPY ALL *.d.ts FILES MANUALLY TO DIST
  //
  const allTypeDefinitionFiles = shell.find('_es2015/src/').filter(file => file.match(/\.d.ts$/));
  for (let i=0; i<allTypeDefinitionFiles.length; i++) {
    const currentFile = allTypeDefinitionFiles[i];
    const currentFilePath = path.dirname(currentFile);
    const targetFilePath = currentFilePath.replace(/^_es2015\/src[/]?/, '../dist/');
    if (!shell.test('-d', targetFilePath)) {
      shell.mkdir('-p', targetFilePath);
    };
    shell.cp(currentFile, targetFilePath);
  }
}

if (argv.watch) {
  shell.echo('=> WATCH');
  var gaze = new Gaze('../src/**/*');
  gaze.on('all', (event, filepath) => {
    try {
      buildPackage('es5', true);
      buildPackage('es2015', true);
    } catch(err) {
      console.log(err);
    }
  });
} else {
  shell.echo('=> BUILD');
  buildPackage('es5', false);
  buildPackage('es2015', false);
}
