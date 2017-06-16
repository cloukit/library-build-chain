/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
const getES5TsConfig(moduleId) {
  return _getTsConfig('es5', moduleId);
}
const getES2015TsConfig(moduleId) {
  return _getTsConfig('es2015', moduleId);
}
const _getTsConfig(target, moduleId) {
  return {
    compilerOptions: {
      declaration: true,
      module: 'es2015',
      target: target,
      baseUrl: '.',
      stripInternal: true,
      experimentalDecorators: true,
      moduleResolution: 'node',
      outDir: '../build',
      rootDir: '.',
      lib: ['es2015', 'dom'],
      skipLibCheck: true,
      types: []
    },
    files: [
      './index.ts'
    ],
    angularCompilerOptions: {
      annotateForClosureCompiler: true,
      strictMetadataEmit: true,
      skipTemplateCodegen: true,
      flatModuleOutFile: `${moduleId}.js`,
      flatModuleId: moduleId
    }
  };
}
