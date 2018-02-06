import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";
import { Novel } from "../../common/models/novel";
import { EpubService } from "../../providers/epub-service";
import { NovelsLocalService } from "../../providers/novels-local-service";
import { SettingsService } from "../../providers/settings-service";
import _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-list',
  templateUrl: 'ln-downloads-list.html',
})
export class LnDownloadsListPage {
  novels: Array<Novel> = [];
  epubs: Array<Novel> = [];
  selectedNovels: Array<Novel> = [];
  selectedEpubs: Array<Novel> = [];
  selectionEnabled = false;

  constructor(public navCtrl: NavController,
    public downloadService: DownloadService,
    private epubService: EpubService,
    private loadingCtrl: LnLoadingController,
    private storage: Storage,
    private novelsLocalService: NovelsLocalService,
    private settingsService: SettingsService,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsListPage');
    this.updateNovelList();
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingCtrl.presentLoadingMessage().then(() => {
        let downloadNovels = this.getDownloadedNovels();
        let downloadEpubs = this.getDownloadedEpubs();

        Promise.all([downloadNovels, downloadEpubs])
          .then(() => {
            this.loadingCtrl.hideLoadingMessage();
            resolve();
          })
          .catch(() => {
            this.loadingCtrl.hideLoadingMessage();
            reject();
          });
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
    if (this.selectionEnabled) {
      this.toggleSelection(novel, this.selectedNovels);
      return;
    }

    this.navCtrl.push('LnDetailsTabs', novel.id);
  }

  openEpub(epub: Novel) {
    if (this.selectionEnabled) {
      this.toggleSelection(epub, this.selectedEpubs);
      return;
    }

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

  toggleSelection(novel: Novel, list: Array<Novel>) {
    // check if novel if list
    // if in list then remove it
    const hasItem = this.isInList(novel, list);
    if (hasItem) {
      _.pull(list, novel);
    } else {
      list.push(novel);
    }
  }

  isInList(novel: Novel, list: Array<Novel>) {
    return _.includes(list, novel);
  }

  delete() {
    let deleteAlert = this.alertCtrl.create({
      title: "Delete",
      message: "Are you sure you want to delete the selected items?",
      buttons: [
        {
          text: "Cancel",
          handler: () => { }
        },
        {
          text: "YES!",
          handler: () => {
            deleteAlert.dismiss().then(() => {
              this.disableSelection();
              this.loadingCtrl.presentLoadingMessage().then(() => {
                let deleteEpubs = this.epubService.deleteEpubs(this.selectedEpubs);
                let deleteNovels = this.downloadService.deleteNovels(this.selectedNovels);

                Promise.all([deleteEpubs, deleteNovels])
                  .then(() => {
                    this.updateNovelList().then(() => {
                      this.loadingCtrl.hideLoadingMessage();
                    });
                  })
              });
            });
          }
        }
      ]
    });
    deleteAlert.present();
  }

  enableSelection() {
    this.selectionEnabled = true;
  }

  disableSelection() {
    this.selectionEnabled = false;
  }

  get noneSelected() {
    return this.selectedEpubs.length == 0 && this.selectedNovels.length == 0;
  }

}
