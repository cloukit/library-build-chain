import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [ DemoComponent ],
  exports: [ DemoComponent ],
  imports: [ CommonModule ],
  providers: [],
  bootstrap: [ ]
})
export class DemoModule { }
