#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */

 //
 // THIS IS THE BUILDFILE FOR library-build-chain ITSELF !!!!
 //
const shell = require('shelljs');

if (shell.test('-d', 'dist')) {
  shell.rm('-rf', 'dist');
}
shell.mkdir('dist');
if (shell.test('-d', './demo-template/node_modules')) shell.rm('-rf', './demo-template/node_modules/');
shell.cp('-r', 'demo-template', './dist/');
shell.cp('build-package-json-template.js', './dist/');
shell.cp('build-tsconfig-template.js', './dist/');
shell.cp('build.js', './dist/');
shell.cp('package.json', './dist/');
shell.cp('README.md', './dist/');
shell.cp('LICENSE', './dist/');
