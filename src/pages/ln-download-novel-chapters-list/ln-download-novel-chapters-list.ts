import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chapter } from "../../common/models/chapter";
import { DownloadService } from "../../providers/download-service";
import { DownloadStatus, DownloadChapterItem } from "../../common/models/download-item";
import _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-ln-download-novel-chapters-list',
  templateUrl: 'ln-download-novel-chapters-list.html',
})
export class LnDownloadNovelChaptersListPage {

  chapters: Array<Chapter> = [];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private downloadService: DownloadService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadNovelChaptersListPage');
    this.getChapters();
  }

  getChapters() {
    let novelId = this.navParams.data;
    this.chapters = this.downloadService.getNovelChaterListFromQueue(novelId);
  }

  status(item: DownloadChapterItem) {
    switch (item.status) {
      case DownloadStatus.Pending: return "Pending";
      case DownloadStatus.Ongoing: return "Ongoing";
      case DownloadStatus.Completed: return "Completed";
      case DownloadStatus.Error: return "Error";
    }
  }

  statusColor(item: DownloadChapterItem) {
    switch (item.status) {
      case DownloadStatus.Pending: return "light";
      case DownloadStatus.Ongoing: return "secondary";
      case DownloadStatus.Completed: return "primary";
      case DownloadStatus.Error: return "danger";
    }
  }

  get groupedChapters() {
    let groups = {
      pending: { chapters: [], header: "Pending" },
      ongoing: { chapters: [], header: "Ongoing" },
      completed: { chapters: [], header: "Completed" },
      error: { chapters: [], header: "Error" }
    };

    _.each(this.chapters, chapter => {
      switch (chapter.status) {
        case DownloadStatus.Pending:
          groups.pending.chapters.push(chapter);
          break;
        case DownloadStatus.Ongoing:
          groups.ongoing.chapters.push(chapter);
          break;
        case DownloadStatus.Completed:
          groups.completed.chapters.push(chapter);
          break;
        case DownloadStatus.Error:
          groups.error.chapters.push(chapter);
          break;
      }
    });

    return groups;
  }

}
