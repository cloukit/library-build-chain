import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DemoComponent } from '../demo/demo.component';
/*___IMPORTS___*/


@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    /*___NGMODULE_IMPORTS___*/
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
