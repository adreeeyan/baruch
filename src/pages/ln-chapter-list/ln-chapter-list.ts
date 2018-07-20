import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
import { NovelsService } from "../../providers/novels-service";
import { Chapter } from "../../common/models/chapter";
import { ChaptersService } from "../../providers/chapters-service";
import { LnLoadingController } from "../../common/ln-loading-controller";
import { DownloadService } from "../../providers/download-service";

import _ from "lodash";

@IonicPage()
@Component({
  selector: "ln-chapter-list",
  templateUrl: "ln-chapter-list.html",
})
export class LnChapterListPage {
  chapters: Chapter[] = [];
  isFinishedLoading: boolean = false;
  constructor(private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private novelService: NovelsService,
    private chaptersService: ChaptersService,
    private downloadService: DownloadService,
    private loadingCtrl: LnLoadingController) {
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter LnChapterListPage");
    this.loadingCtrl.presentLoadingMessage();
    let id = this.navParams.data;
    this.novelService
      .getNovelChapterList(id)
      .then(chapters => {
        this.chapters = chapters;
        this.isFinishedLoading = true;
        this.toggleRead();
        this.loadingCtrl.hideLoadingMessage();
      });
  }

  private async toggleRead() {
    if (!this.isFinishedLoading) {
      return;
    }
    const readChapters = await this.chaptersService.getAllReadChapters();
    this.chapters.forEach(chapter => {
      if(_.includes(readChapters, chapter.id)){
        chapter.isRead = true;
      }
    });
  }

  openChapter(chapter) {
    // put settimeout to hide the animation to the user
    setTimeout(() => {
      chapter.isRead = true;
    }, 500);
    this.app.getRootNav().push('LnChapterPage', {
      novelId: this.navParams.data,
      chapterNumber: chapter.number
    });
  }

}
