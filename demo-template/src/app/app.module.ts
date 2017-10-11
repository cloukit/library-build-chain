import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DemoComponent } from '../demo/demo.component';

const ngDeclarations = [ AppComponent, DemoComponent ];
const ngImports = [ BrowserModule ];
const ngProviders = [ ];
const ngBootStrap = [ ];

/*___IMPORTS___*/

@NgModule({
  declarations: ngDeclarations,
  imports: ngImports,
  providers: ngProviders,
  bootstrap: ngBootStrap
})
export class AppModule { }
