# ng-library-build

Common code to build the cloukit Angular libraries based on [angular-quickstart-lib](https://github.com/filipesilva/angular-quickstart-lib) and [simple-ui-lib](https://github.com/jasonaden/simple-ui-lib)

-----

&nbsp;

### Module Format

Each library comes as an tree-shakeable and AOT enabled flat ES2015 Module.
See [YouTube Packaging Angular - Jason Aden - ng-conf 2017]()https://www.youtube.com/watch?v=unICbsPGFIA) for in depth explanation.

-----

&nbsp;

### Metadata for each Library

The library itself has `metadata.json` containing:

```json
{
  "moduleId": "@cloukit/multi-select",
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
git clone https://github.com/cloukit/ng-library-build.git build
cd build/
npm install
npm run build
```

Now there will be a `dist/` directory containing everything that can now be published to npmjs.com

```bash
cd dist/
npm --registry https://registry.npmjs.org/ login
npm --registry https://registry.npmjs.org/ --access public publish
```

-----

&nbsp;

## License

[MIT](./LICENSE) © [Bernhard Grünewaldt](https://github.com/clouless)
