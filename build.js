#!/usr/bin/env node

/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const Gaze = require('gaze').Gaze;
const argv = require('yargs').argv
const NGC_BINARY='../library-build-chain/node_modules/.bin/ngc';
const ROLLUP_BINARY='../library-build-chain/node_modules/.bin/rollup';
const tsconfigTemplate = require('./build-tsconfig-template.js');
const packageJsonTemplate = require('./build-package-json-template.js');
const currentDir = shell.pwd().stdout;
const relativePath = (_path) => {
  return path.resolve(currentDir, _path);
}

/**
 * Build the package to dist
 * @param languageTarget {string} either 'es5' or 'es2015'
 * @param watch {boolean}
 */
const buildPackage = (languageTarget, watch) => {
  //
  // CLEANUP COPY SRC CONTENTS TO BUILD
  //
  if (shell.test('-d', relativePath('../build/src'))) shell.rm('-rf', relativePath('../build/src'));
  if (shell.test('-f', relativePath('../build/package-lock.json'))) shell.rm('-rf', relativePath('../build/package-lock.json'));
  if (!shell.test('-d', relativePath('../build/'))) shell.mkdir(relativePath('../build/'));
  shell.cp('-R', relativePath('../src'), relativePath('../build'));
  shell.cp('-R', relativePath('../manifest.json'), relativePath('../build'));

  //
  // CD BUILD DIR
  //
  shell.cd(relativePath('../build/'));
  const manifest = JSON.parse(shell.cat(relativePath('../build/manifest.json')));

  //
  // GENERATE TEMPORARY LIBRARY package.json TO INSTALL PEER DEPENDENCIES DURING BUILD
  //
  if (!watch && languageTarget === 'es5') {
    let packageJson = packageJsonTemplate.generate(manifest.moduleId, manifest.version, manifest.description, 'devDependencies', Object.assign({}, manifest.peerDependencies, manifest.devDependencies), 'dependencies', manifest.dependencies, 'peerDependencies', {});
    fs.writeFileSync(relativePath(`../build/package.json`), JSON.stringify(packageJson, null, 2));
    shell.echo(chalk.blue('>> =============='));
    shell.echo(chalk.blue('>> NPM INSTALL'));
    shell.echo(chalk.blue('>> =============='));
    const npmInstallResult = shell.exec('npm install');
    if (npmInstallResult.code !== 0) {
        shell.echo(chalk.red("NPM ERROR. STOP!"));
        return;
    }
  }

  //
  // BUILD OR WATCH
  //
  shell.echo(chalk.blue('>> =============='));
  shell.echo(chalk.blue(`>> ${watch ? 'WATCH' : 'BUILD'} : ${languageTarget}`));
  shell.echo(chalk.blue('>> =============='));


  //
  // WRITE TSCONFIGS
  //
  const tsConfig = tsconfigTemplate.generate(languageTarget, manifest.moduleId);
  fs.writeFileSync(relativePath(`../build/tsconfig-${languageTarget}.json`), JSON.stringify(tsConfig, null, 2));

  //
  // BUILD WITH ANGULAR COMPILER
  //
  const buildResult = shell.exec(`${NGC_BINARY} -p tsconfig-${languageTarget}.json`);
  if (buildResult.code !== 0) {
      shell.echo(chalk.red("NGC ERROR. STOP!"));
      return;
  }

  //
  // BUILD FLAT ONE FILE MODULE WITH ROLLUP
  //
  const rollupResult = shell.exec(`${ROLLUP_BINARY} _${languageTarget}/src/${manifest.moduleId}.js -o ../dist/${manifest.moduleId}.${languageTarget}.js`);
  if (rollupResult.code !== 0) {
      shell.echo(chalk.red("ROLLUP ERROR. STOP!"));
      return;
  }

  // ====================
  // DO ONLY ONCE FROM HERE
  if (languageTarget === 'es5') return;
  // ====================

  //
  // WRITE FINAL LIB package.json
  //
  packageJson = packageJsonTemplate.generate(manifest.moduleId, manifest.version, manifest.description, 'peerDependencies', manifest.peerDependencies, 'dependencies', manifest.dependencies, 'devDependencies', manifest.devDependencies);
  fs.writeFileSync(relativePath('../dist/package.json'), JSON.stringify(packageJson, null, 2));

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
  shell.echo(chalk.blue('>> =============='));
  shell.echo(chalk.blue(`>> D.TS FILES`));
  shell.echo(chalk.blue('>> =============='));
  fse.copySync(relativePath('../build/_es2015/src'), relativePath('../dist'), {
    filter: file => /^.*[.]ts$/.test(file) || shell.test('-d', file) // *.d.ts files and folders!
  });

  //
  // COMPODOC
  //
  /*

  cd build
  # PATCH page template
  wget https://cloukit.github.io/compodoc-theme/patches/1.0.0-beta.10/src/templates/page.hbs -O ../library-build-chain/node_modules/compodoc/src/templates/page.hbs
  ../library-build-chain/node_modules/compodoc/bin/compodoc --tsconfig tsconfig-es5.json --hideGenerator --disableSourceCode src
  rm -rf documentation/fonts/
  rm -rf documentation/images/
  rm -rf documentation/styles/
  rm -rf documentation/js/
  */

  if (!argv.watch) {
    shell.cd(relativePath('../'));
    const ngdResult = shell.exec('ngd --output-formats svg,json --file src/components/*.module.ts');
    if (ngdResult.code !== 0) {
        shell.echo(chalk.red("NGD ERROR. STOP!"));
        return;
    }
    shell.mv(`./documentation`, `./dist/`);
  }

}


//
// INIT
//
const initialCleanup = () => {
  if (shell.test('-d', relativePath('../documentation'))) shell.rm('-rf', relativePath('../documentation/'));
  if (shell.test('-d', relativePath('../dist'))) shell.rm('-rf', relativePath('../dist/'));
  shell.mkdir(relativePath('../dist/'));
};

if (argv.watch) {
  var gaze = new Gaze('../src/**/*');
  gaze.on('all', (event, filepath) => {
    try {
      //initialCleanup();
      buildPackage('es5', true);
      buildPackage('es2015', true);
      shell.echo(chalk.green('>> =============='));
      shell.echo(chalk.green('>> DONE'));
      shell.echo(chalk.green('>> =============='));
    } catch(err) {
      console.log(err);
    }
  });
} else {
  initialCleanup();
  buildPackage('es5', false);
  buildPackage('es2015', false);
  shell.echo(chalk.green('>> =============='));
  shell.echo(chalk.green('>> DONE'));
  shell.echo(chalk.green('>> =============='));
}
