# Library Demo

Due to `npm link` problems we use the `demo-template` which starts a full angular project using angular-cli
with our project included. This demo is also published to gh-pages as example for cloukit.github.io previews.

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
  
 
