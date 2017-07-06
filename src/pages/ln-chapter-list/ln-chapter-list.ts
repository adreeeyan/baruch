import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public novelService: NovelsService,
    public chaptersService: ChaptersService,
    private downloadService: DownloadService,
    private loadingCtrl: LnLoadingController) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnChapterListPage");
    this.loadingCtrl.presentLoadingMessage();
    let id = this.navParams.data;
    let chaptersRetrievalServices = [this.downloadService.getNovelChapterList(id), this.novelService.getNovelChapterList(id).toPromise()];

    Promise.all(chaptersRetrievalServices)
      .then(chapters => {
        let combinedChapters = [];
        let offlineChapters = chapters[0];
        let onlineChapters = chapters[1];

        // add all the offline chapters
        combinedChapters = combinedChapters.concat(offlineChapters);

        // add the online chapters that does not exist in offline chapters
        _.each(onlineChapters, chapter => {
          let foundChapter = _.find(offlineChapters, chap => chap.id === chapter.id);
          if(!foundChapter){
            combinedChapters.push(chapter);
          }
        });
        
        this.chapters = combinedChapters;
        this.isFinishedLoading = true;
        this.ionViewDidEnter();
        this.loadingCtrl.hideLoadingMessage();
      });
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter LnChapterListPage");
    if (!this.isFinishedLoading) {
      return;
    }
    this.chapters.forEach(chapter => {
      this.checkIfChapterIsRead(chapter);
    });
  }

  checkIfChapterIsRead(chapter) {
    this.chaptersService
      .isRead(chapter.id)
      .then(() => {
        chapter.isRead = true;
      })
      .catch(() => {
        chapter.isRead = false;
      });
  }

  openChapter(chapter) {
    // put settimeout to hide the animation to the user
    setTimeout(() => {
      chapter.isRead = true;
    }, 500);
    this.navCtrl.push('LnChapterPage', {
      novelId: this.navParams.data,
      chapterNumber: chapter.number
    });
  }

}
