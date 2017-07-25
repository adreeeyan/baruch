import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadService } from "../../providers/download-service";
import { DownloadItem, EpubDownloadItem } from "../../common/models/download-item";
import { EpubService } from "../../providers/epub-service";

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
    private epubService: EpubService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsQueuePage');

    this.queue = this.downloadService.queue;
    this.epubQueue = this.epubService.queue;
  }

  navigateToNovel(item) {
    this.navCtrl.push('LnDownloadNovelChaptersListPage', item.id);
  }

}
