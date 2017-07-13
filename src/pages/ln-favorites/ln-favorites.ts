import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Novel } from '../../common/models/novel';
import { FavoritesService } from '../../providers/favorites-service';
import { LnLoadingController } from "../../common/ln-loading-controller";

@IonicPage()
@Component({
  selector: 'page-ln-favorites',
  templateUrl: 'ln-favorites.html',
  styles: ['ln-favorites.scss']
})
export class LnFavorites {
  novels: Array<Novel>;

  constructor(public navCtrl: NavController,
    public favoritesService: FavoritesService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnFavorites');
    this.updateNovelList();
  }

  updateNovelList(): Promise<any> {
    this.loadingCtrl.presentLoadingMessage();
    return new Promise((resolve) => {
      this.favoritesService
        .getNovels()
        .then((novels: Array<Novel>) => {
          this.novels = novels;
          this.loadingCtrl.hideLoadingMessage();
          resolve();
        })
        .catch(() => {
          this.loadingCtrl.hideLoadingMessage();
        });
    });
  }
}
