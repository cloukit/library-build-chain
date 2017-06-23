/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
exports.generate = (moduleId, version, description, dependencyType, dependencies, dependencyType2, dependencies2, dependencyType3, dependencies3) => {
  const packageJson = {
    name: `@cloukit/${moduleId}`,
    version: version,
    description: description,
    private: false,
    config: {
      access: 'public'
    },
    license: 'MIT',
    repository: {
      type: 'git',
      url: `https://github.com/cloukit/${moduleId}.git`
    },
    module: `${moduleId}.es5.js`,
    es2015: `${moduleId}.es2015.js`,
    typings: `${moduleId}.d.ts`,
    author: 'codeclou.io',
  };
  packageJson[dependencyType] = dependencies;
  packageJson[dependencyType2] = dependencies2;
  packageJson[dependencyType3] = dependencies3;
  return packageJson;
};
