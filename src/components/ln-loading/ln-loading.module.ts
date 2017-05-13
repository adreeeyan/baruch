import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnLoading } from './ln-chapter-reader';

@NgModule({
  declarations: [
    LnLoading,
  ],
  imports: [
    IonicPageModule.forChild(LnLoading),
  ],
  exports: [
    LnLoading
  ]
})
export class LnLoadingModule {}
