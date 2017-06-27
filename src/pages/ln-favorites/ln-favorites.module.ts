import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnFavorites } from './ln-favorites';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";

@NgModule({
  declarations: [
    LnFavorites,
  ],
  imports: [
    LnNovelListModule,
    IonicPageModule.forChild(LnFavorites),
  ],
  exports: [
    LnFavorites
  ]
})
export class LnFavoritesModule {}
