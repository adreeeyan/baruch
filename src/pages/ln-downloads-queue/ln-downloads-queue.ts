import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadService } from "../../providers/download-service";
import { DownloadItem } from "../../common/models/download-item";

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
    console.log('ionViewDidLoad LnDownloadsQueuePage');

    this.queue = this.downloadService.queue;
  }

  navigateToNovel(item) {
    this.navCtrl.push('LnDownloadNovelChaptersListPage', item.id);
  }

}
