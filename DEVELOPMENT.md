# Development


**Build**

See: https://github.com/cloukit/library-build-chain

&nbsp;

# Howto Link Lib during Development

(1) Go to component project and type to build the component

```
git clone https://github.com/cloukit/ng-library-build.git library-build-chain
cd library-build-chain
npm install
npm run build
cd ../
# symlink node_modules
ln -s build/node_modules
```

(2) Now `dist/` folder appeared:

```
cd dist/
npm link
```

(3) Link into project 

see: https://docs.npmjs.com/cli/link

```
cd my-test-project
npm link @cloukit/foo  # with foo = component name
```

(4) Now you should be able to do in your testproject

```typescript
import { FooModule } from '@cloukit/foo';
```
