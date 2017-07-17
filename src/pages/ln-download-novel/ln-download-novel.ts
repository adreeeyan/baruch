import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { Novel } from "../../common/models/novel";
import { DownloadService } from "../../providers/download-service";
import { LnLoadingController } from "../../common/ln-loading-controller";
import _ from "lodash";
import { DownloadChapterItem, DownloadStatus } from "../../common/models/download-item";

@IonicPage()
@Component({
  selector: 'page-ln-download-novel',
  templateUrl: 'ln-download-novel.html',
})
export class LnDownloadNovelPage {
  novel: Novel;
  chapters: DownloadChapterItem[] = [];
  chapterDetailsHeader: any;
  isUpdated: boolean = false;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private downloadService: DownloadService,
    private loadingCtrl: LnLoadingController,
    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadNovelPage');
    this.novel = this.navParams.data;

    this.loadingCtrl.presentLoadingMessage();
    this.downloadService
      .getUndownloadedChapters(this.novel.id)
      .then((chapters: DownloadChapterItem[]) => {
        // check if nothing is new
        this.isUpdated = chapters.length === 0;

        // check all chapters and put it to pending state
        _.each(chapters, chapter => {
          chapter.checked = true;
          chapter.status = DownloadStatus.Pending;
        });

        this.chapters = chapters.reverse();
        this.loadingCtrl.hideLoadingMessage();
      });
  }

  selectPopover(evt) {
    let popover = this.popoverCtrl.create("LnDownloadNovelChaptersPopup", { chapters: this.chapters });
    popover.present({
      ev: evt
    });
  }

  get selectedChapters() {
    return _.filter(this.chapters, (chapter: DownloadChapterItem) => chapter.checked);
  }

  download() {
    this.downloadService.addToQueue(this.novel, this.selectedChapters);
    this.app.getRootNav().setRoot("LnDownloadsQueuePage");
  }

}
