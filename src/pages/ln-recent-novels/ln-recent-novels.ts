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
  styles: ['ln-recent-novels.scss']
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
    this.updateNovelList();
  }

  updateNovelList(): Promise<any> {
    this.loadingCtrl.presentLoadingMessage();
    return new Promise((resolve) => {
      this.recentNovelsService
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
