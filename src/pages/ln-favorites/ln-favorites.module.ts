import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnFavorites } from './ln-favorites';

@NgModule({
  declarations: [
    LnFavorites,
  ],
  imports: [
    IonicPageModule.forChild(LnFavorites),
  ],
  exports: [
    LnFavorites
  ]
})
export class LnFavoritesModule {}
