import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DemoComponent } from '../demo/demo.component';

const ngDeclarations: any = [ AppComponent, DemoComponent ];
const ngImports: any = [ BrowserModule ];
const ngProviders: any = [ ];
const ngBootStrap: any = [ AppComponent ];

/*___IMPORTS___*/

@NgModule({
  declarations: ngDeclarations,
  imports: ngImports,
  providers: ngProviders,
  bootstrap: ngBootStrap
})
export class AppModule { }
