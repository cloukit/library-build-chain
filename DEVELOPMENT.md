# Development

-----

&nbsp;

### Module Format - FESM

Each library comes as an tree-shakeable and AOT enabled flat ES2015 Module.
See [YouTube Packaging Angular - Jason Aden - ng-conf 2017]()https://www.youtube.com/watch?v=unICbsPGFIA) for in depth explanation.

-----

&nbsp;

### Metadata for each Library

The library itself has `package.json` containing:

```json
{
  "name": "@cloukit/multi-select",
  "moduleId": "multi-select",
  "version": "1.1.0",
  "dependencies": {

  },
  "devDependencies": {
    "@cloukit/library-build-chain": "1.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^4.0.1",
    "rxjs": "^5.3.0",
    "zone.js": "^0.8.5"
  }
}
```

which will then be transformed into `./dist/package.json`:

```json
{
  "name": "@cloukit/multi-select",
  "author": "codeclou.io",
  "version": "1.1.0",
  "license": "MIT",
  "module": "cloukit-multi-select.es5.js",
  "es2015": "cloukit-multi-select.js",
  "typings": "cloukit-multi-select.d.ts",
  "dependencies": {

  },
  "devDependencies": {
    "@cloukit/library-build-chain": "1.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^4.0.1",
    "rxjs": "^5.3.0",
    "zone.js": "^0.8.5"
  }
}
```

-----

&nbsp;

### Building a Library and Publishing to npmjs.com

Goto the component dir containing `package.json` and execute:

```bash
yarn
yarn build
```

Now there will be a `./dist/` directory containing everything that can now be published to npmjs.com

:bangbang: Publishing is done by `jenkins.sh` via Jenkins on TAG-Job run.

Therefore tag you library like so

```bash
git tag -a 1.0.2 -m "1.0.2"
git push origin 1.0.2
```

-----

&nbsp;

### Setup for a Library

  * (1) Create `package.json`
  * (2) Copy `.gitignore` from `@cloukit/toggle`
    * see example: https://github.com/cloukit/toggle/blob/master/.gitignore
  * (3) Main file with exports is expected to be `../src/index.ts`
    * see example: https://github.com/cloukit/toggle
  * (4) add Webhook to codeclou.io jenkins
  * (5) Create Jenkins Pipeline Job for project with convention "cloukit---COMPONENTNAME"

-----


&nbsp;

### Howto test a Library during Development

Due to `npm link` problems we use the `demo-template` which starts a full angular project using angular-cli
with our project included.

So what happens when I am in my Library e.g. toggle and want the demo angular project to build?

 * 1. Demo-Tamplate `./node-modules/@cloukit/demo-template` is copied to `./dist-demo/`
 * 2. The component code `./src/*` is copied to `dist-demo/src/*`
 * 3. Your library MUST have the files:
   * `./src/demo/demo.component.html`
   * `./src/demo/demo.component.ts`
   * Those files should contain the whole demo
 * 4. The `dist-demo/src/app/app.component.ts`  is patched for:
   * `/*___IMPORTS___*/` is replaced by e.g. `import { CloukitToggleModule } from '../components/toggle/toggle.module';`
   * `/*___NGMODULE_IMPORTS___*/` is replaced by e.g. `CloukitToggleModule`
 * 5. `ng serve` is executed internally and your demo is hosted at http://localhost:4200
  
 



