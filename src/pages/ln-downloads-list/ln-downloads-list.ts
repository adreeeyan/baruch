import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";
import { Novel } from "../../common/models/novel";
import { EpubService } from "../../providers/epub-service";
import { NovelsLocalService } from "../../providers/novels-local-service";
import { SettingsService } from "../../providers/settings-service";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-list',
  templateUrl: 'ln-downloads-list.html',
})
export class LnDownloadsListPage {
  novels: Array<Novel> = [];
  epubs: Array<Novel> = [];

  constructor(public navCtrl: NavController,
    public downloadService: DownloadService,
    private epubService: EpubService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage,
    private novelsLocalService: NovelsLocalService,
    private settingsService: SettingsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsListPage');
    this.updateNovelList();
  }

  updateNovelList(): Promise<any> {
    this.loadingCtrl.presentLoadingMessage();
    return new Promise((resolve) => {
      let downloadNovels = this.getDownloadedNovels();
      let downloadEpubs = this.getDownloadedEpubs();

      Promise.all([downloadNovels, downloadEpubs])
        .then(() => {
          this.loadingCtrl.hideLoadingMessage();
        })
        .catch(() => {
          this.loadingCtrl.hideLoadingMessage();
        });
    });
  }

  getDownloadedNovels(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.downloadService
        .getNovels()
        .then((novels) => {
          this.novels = novels;
          resolve();
        });
    });
  }

  getDownloadedEpubs(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.epubService
        .getDownloadedEpubs()
        .then((epubs) => {
          this.epubs = epubs;
          resolve();
        });
    });
  }

  openNovel(novel: Novel) {
    this.navCtrl.push('LnDetailsTabs', novel.id);
  }

  openEpub(epub: Novel) {
    this.novelsLocalService.getNovel(epub.id.toString())
      .then((novel) => {
        let location = this.settingsService.settings.epubLocation;
        (<any>window).cordova.plugins.disusered.open(
          `${location}${novel.title}.epub`,
          () => {
            console.log("Successfully opened file.");
          },
          (err) => {
            console.log("There was an issue opening the file.", err)
          });
      });
  }

}
