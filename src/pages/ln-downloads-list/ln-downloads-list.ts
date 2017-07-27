import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";
import { Novel } from "../../common/models/novel";
import { EpubService } from "../../providers/epub-service";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-list',
  templateUrl: 'ln-downloads-list.html',
})
export class LnDownloadsListPage {
  novels: Array<Novel>;

  constructor(public navCtrl: NavController,
    public downloadService: DownloadService,
    private epubService: EpubService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsListPage');
    this.updateNovelList();

    this.epubService.getDownloadedEpubs();
  }

  updateNovelList(): Promise<any> {
    this.loadingCtrl.presentLoadingMessage();
    return new Promise((resolve) => {
      this.downloadService
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
