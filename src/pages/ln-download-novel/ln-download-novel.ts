import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { Novel } from "../../common/models/novel";
import { DownloadService } from "../../providers/download-service";
import { Chapter } from "../../common/models/chapter";
import { LnLoadingController } from "../../common/ln-loading-controller";
import _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-ln-download-novel',
  templateUrl: 'ln-download-novel.html',
})
export class LnDownloadNovelPage {
  novel: Novel;
  chapters: ChapterDownload[] = [];
  chapterDetailsHeader: any;
  tabBarElement: any;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private downloadService: DownloadService,
    private loadingCtrl: LnLoadingController,
    private app: App) {
    this.chapterDetailsHeader = document.querySelector("page-ln-details-tabs ion-header");
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  ionViewWillEnter() {
    // hide the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "none";
    if (this.tabBarElement) this.tabBarElement.style.display = "none";
  }

  ionViewWillLeave() {
    // show the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "flex";
    if (this.tabBarElement) this.tabBarElement.style.display = "flex";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadNovelPage');
    this.novel = this.navParams.data;

    this.loadingCtrl.presentLoadingMessage();
    this.downloadService
      .getUndownloadedChapters(this.novel.id)
      .then((chapters: ChapterDownload[]) => {
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
    return _.filter(this.chapters, (chapter: ChapterDownload) => chapter.checked);
  }

  download() {
    this.downloadService.addToQueue(this.novel, this.selectedChapters);
    this.app.getRootNav().setRoot("LnDownloadsQueuePage");
  }

}

class ChapterDownload extends Chapter {
  checked: boolean;
}
