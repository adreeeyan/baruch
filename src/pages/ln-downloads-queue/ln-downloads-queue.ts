import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DownloadService } from "../../providers/download-service";
import { DownloadItem, EpubDownloadItem } from "../../common/models/download-item";
import { EpubService } from "../../providers/epub-service";
import { FileOpener } from "@ionic-native/file-opener";
import { SettingsService } from "../../providers/settings-service";
import { NovelsLocalService } from "../../providers/novels-local-service";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-queue',
  templateUrl: 'ln-downloads-queue.html',
})
export class LnDownloadsQueuePage {

  queue: DownloadItem[] = [];
  epubQueue: EpubDownloadItem[] = [];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private downloadService: DownloadService,
    private epubService: EpubService,
    private settingsService: SettingsService,
    private novelsLocalService: NovelsLocalService,
    private fileOpener: FileOpener,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsQueuePage');

    this.queue = this.downloadService.queue;
    this.epubQueue = this.epubService.queue;
  }

  navigateToNovel(item) {
    this.navCtrl.push('LnDownloadNovelChaptersListPage', item.id);
  }

  openEpub(item: EpubDownloadItem) {
    if (item.progress < 100) {
      this.toastCtrl.create({
        message: "Wait for it to be finished!",
        dismissOnPageChange: true,
        position: "bottom",
        showCloseButton: true,
        duration: 2000
      }).present();
      return;
    }
    this.novelsLocalService.getNovel(item.novel.id.toString())
      .then((novel) => {
        let location = this.settingsService.settings.epubLocation;
        this.fileOpener.open(`${location}${novel.title}.epub`, "application/epub+zip")
          .then(() => {
            console.log("Successfully opened file.");
          })
          .catch((err) => {
            console.log("There was an issue opening the file.", err)
          });
      });
  }

}
