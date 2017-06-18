# library-build-chain

Common code to build the cloukit Angular libraries based on [angular-quickstart-lib](https://github.com/filipesilva/angular-quickstart-lib) and [simple-ui-lib](https://github.com/jasonaden/simple-ui-lib)

:bangbang: SEE [DEVELOPMENT.md](./DEVELOPMENT.md)

-----

&nbsp;

### Module Format - FESM

Each library comes as an tree-shakeable and AOT enabled flat ES2015 Module.
See [YouTube Packaging Angular - Jason Aden - ng-conf 2017]()https://www.youtube.com/watch?v=unICbsPGFIA) for in depth explanation.

-----

&nbsp;

### Metadata for each Library

The library itself has `metadata.json` containing:

```json
{
  "moduleId": "multi-select",
  "version": "1.1.0",
  "peerDependencies": {
    "@angular/core": "^4.0.1",
    "rxjs": "^5.3.0",
    "zone.js": "^0.8.5"
  }
}
```

which will then be transformed into:

```json
{
  "name": "@cloukit/multi-select",
  "author": "codeclou.io",
  "version": "1.1.0",
  "license": "MIT",
  "module": "cloukit-multi-select.es5.js",
  "es2015": "cloukit-multi-select.js",
  "typings": "cloukit-multi-select.d.ts",
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

Goto the library dir containing `metadata.json` and execute:

```bash
git clone https://github.com/cloukit/library-build-chain.git library-build-chain
cd library-build-chain
npm install
npm run build
```

Now there will be a `../dist/` directory containing everything that can now be published to npmjs.com

:bangbang: Publishing is done by `jenkins.sh` via Jenkins on TAG-Job run.

Therefore tag you library like so

```bash
git tag -a 1.0.2 -m "1.0.2"
git push origin 1.0.2
```

-----

&nbsp;

### Setup for a Library

  * (1) Create `manifest.json`
  * (2) Add `library-build-chain`, `build`, `dist` to `.gitignore`
  * (3) Main file with exports is expected to be `../src/index.ts` 
    * see example: https://github.com/cloukit/common
  * (4) place `jenkins.sh` at root
    * see example: https://github.com/cloukit/common/blob/master/jenkins.sh
  * (5) add Webhook to codeclou.io jenkins
  * (6) Create Jenkins Job for project

-----

&nbsp;

## License

[MIT](./LICENSE) © [Bernhard Grünewaldt](https://github.com/clouless)
