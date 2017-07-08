import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadService, DownloadItem } from "../../providers/download-service";

@IonicPage()
@Component({
  selector: 'page-ln-downloads-queue',
  templateUrl: 'ln-downloads-queue.html',
})
export class LnDownloadsQueuePage {

  queue: DownloadItem[] = [];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private downloadService: DownloadService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsPage');

    this.queue = this.downloadService.queue;
  }

  navigateToNovel(item) {
    this.navCtrl.push('LnChapterListPage', item.id);
  }

}
