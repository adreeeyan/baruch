import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadService, DownloadItem } from "../../providers/download-service";

@IonicPage()
@Component({
  selector: 'page-ln-downloads',
  templateUrl: 'ln-downloads.html',
})
export class LnDownloadsPage {

  queue: DownloadItem[] = [];

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private downloadService: DownloadService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadsPage');

    this.queue = this.downloadService.queue;
  }

}
