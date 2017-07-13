import { NgModule } from '@angular/core';
import { LnImgSrcDirective } from "./ln-img-src";

@NgModule({
  declarations: [
    LnImgSrcDirective,
  ],
  exports: [
    LnImgSrcDirective
  ]
})
export class LnImgSrcDirectiveModule {}
