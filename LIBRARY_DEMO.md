# Library Demo

Due to `npm link` problems we use the `demo-template` which starts a full angular project using angular-cli
with our project included. This demo is also published to gh-pages as example for cloukit.github.io previews.

So what happens when I am in my Library e.g. toggle and want the demo angular project to build?

 * 1. Demo-Tamplate `./node-modules/@cloukit/demo-template` is copied to `./dist-demo/`
 * 2. The component code `./src/*` is copied to `dist-demo/src/*`
 * 3. Your library MUST have the files:
   * `./src/demo/demo.component.html`
   * `./src/demo/demo.component.ts`
   * `./src/demo/demo.imports.txt'`
   * Those files should contain the whole demo code, see [pagination for example]().
 * 4. The `dist-demo/src/app/app.component.ts`  is patched. 
   * `/*___IMPORTS___*/` is replaced by e.g. `src/demo/demo.imports.txt'`
 * 5. `yarn build:demo` followed by `yarn start:demo` is executed internally and your demo is hosted at http://localhost:4200
  
 
Put this into your libraries `package.json`

```
  "scripts": {
    "build": "node ./node_modules/@cloukit/library-build-chain/build.js",
    "build:demo": "node ./node_modules/@cloukit/library-build-chain/build.js --demo --install",
    "start:demo": "node ./node_modules/@cloukit/library-build-chain/build.js --demo --run",
    "watch": "node ./node_modules/@cloukit/library-build-chain/build.js --watch",
    "test": "echo \"ok\""
...    
  "devDependencies": {
    "@cloukit/library-build-chain": "1.4.0"
  },
```

