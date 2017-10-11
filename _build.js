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
  shell.mkdir('dist');
}
shell.mkdir('dist');
shell.cp('demo-template', './dist/');
shell.cp('build-package-json-template.js', './dist/');
shell.cp('build-tsconfig-template.js', './dist/');
shell.cp('build.js', './dist/');
shell.cp('package.json', './dist/');
shell.cp('README.md', './dist/');
shell.cp('LICENSE', './dist/');
