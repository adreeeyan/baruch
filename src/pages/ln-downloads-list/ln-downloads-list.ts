import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";
import { Novel } from "../../common/models/novel";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-list',
  templateUrl: 'ln-downloads-list.html',
})
export class LnDownloadsListPage {
  novels: Array<Novel>;

  constructor(public navCtrl: NavController,
    public downloadService: DownloadService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsListPage');
    this.resetNovelList();
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve) => {
      this.downloadService
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

}
