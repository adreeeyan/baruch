import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Novel } from '../../common/models/novel';
import { FavoritesService } from '../../providers/favorites-service';

@IonicPage()
@Component({
  selector: 'page-ln-favorites',
  templateUrl: 'ln-favorites.html',
  styles: ['ln-favorites.scss']
})
export class LnFavorites {
  novels: Array<Novel>;
  start: number;
  count: number;
  loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public favoritesService: FavoritesService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnFavorites');

    this.loader = this.loadingCtrl.create({
      content: "Fetching your favorites..."
    });
    
    this.resetNovelList();
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve) => {
      this.favoritesService
        .getNovels()
        .then((novels: Array<Novel>) => {
          this.novels = this.novels.concat(novels);
          this.start += novels.length;
          resolve();
        });
    });
  }

  resetNovelList() {
    this.presentLoadingMessage();
    this.novels = [];
    this.start = 0;
    this.count = 50;
    this.updateNovelList()
      .then(() => this.loader.dismiss());
  }

  novelTapped(event, item) {
    this.navCtrl.push('LnDetailsTabs', item.id);
  }

  searchTapped(event, item) {
    this.navCtrl.push('LnSearchPage');
  }

  presentLoadingMessage() {
    this.loader = this.loadingCtrl.create({
      spinner: "hide",
      content: `<img src="assets/loading.gif" /><h3>Fetching your favorites...</h3>`
    });

    this.loader.present();
  }
}
