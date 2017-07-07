/*!
 * @license MIT
 * Copyright (c) 2017 Bernhard Grünewaldt - codeclou.io
 * https://github.com/cloukit/legal
 */
exports.generate = (target, moduleId) => ({
  compilerOptions: {
    declaration: true,
    module: 'es2015',
    target: target,
    baseUrl: '.',
    stripInternal: true,
    experimentalDecorators: true,
    moduleResolution: 'node',
    outDir: `./build/_${target}`,
    rootDir: '.',
    lib: ['es2015', 'dom'],
    skipLibCheck: true,
    types: []
  },
  files: [
    './src/index.ts'
  ],
  angularCompilerOptions: {
    annotateForClosureCompiler: true,
    strictMetadataEmit: true,
    skipTemplateCodegen: true,
    flatModuleOutFile: `${moduleId}.js`,
    flatModuleId: moduleId
  }
});
