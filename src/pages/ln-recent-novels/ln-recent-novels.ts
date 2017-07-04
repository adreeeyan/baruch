import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { Novel } from "../../common/models/novel";
import { RecentNovelsService } from "../../providers/recent-novels-service";

@IonicPage()
@Component({
  selector: 'page-ln-recent-novels',
  templateUrl: 'ln-recent-novels.html',
})
export class LnRecentNovelsPage {
  novels: Array<Novel>;

  constructor(public navCtrl: NavController,
    public recentNovelsService: RecentNovelsService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnRecentNovelsPage');
    this.resetNovelList();
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve) => {
      this.recentNovelsService
        .getNovels()
        .then((novels: Array<Novel>) => {
          this.novels = this.novels.concat(novels);
          resolve();
        });
    });
  }

  resetNovelList() {
    this.loadingCtrl.presentLoadingMessage();
    this.novels = [];
    this.updateNovelList()
      .then(() => this.loadingCtrl.hideLoadingMessage());
  }

  searchTapped(event, item) {
    this.navCtrl.push('LnSearchPage');
  }

}
