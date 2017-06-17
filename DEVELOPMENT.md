# Development


**Build**

See: https://github.com/cloukit/library-build-chain

&nbsp;

# Release

**Howto Publish to npmjs.org**

(0) Have it build and no pending commits

```
git clone https://github.com/cloukit/ng-library-build.git library-build-chain
cd library-build-chain
npm install
npm run build
```

(1) use this because of npm proxy:

```
cd dist/
npm --registry https://registry.npmjs.org/ login
npm --registry https://registry.npmjs.org/ --access public publish
```

(2) Create Git Tag

```
cd ../
git tag -a 0.0.15 -m "rel 0.0.15"
git push origin 0.0.15
```

(3) Go to github releases and create release from tag.

(4) Increase version in package.json.

```
git add . -A && git commit -m "version bump" && git push
```
