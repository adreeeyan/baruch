import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';

@IonicPage()
@Component({
  selector: 'page-ln-list',
  templateUrl: 'ln-list.html',
  styles: ['ln-list.scss']
})
export class LnList {
  novels: Array<Novel>;
  start: number;
  count: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public novelsService: NovelsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnList');
    this.novels = [];
    this.start = 0;
    this.count = 50;
    this.updateNovelList();
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve) => {
      this.novelsService
        .getNovels(this.start, this.count)
        .subscribe((novels: Array<Novel>) => {
          this.novels = this.novels.concat(novels);
          this.start += novels.length;
          resolve();
        });
    });
  }

  novelTapped(event, item) {
    this.navCtrl.push('LnDetailsTabs', item.id);
  }

  searchTapped(event, item) {
    this.navCtrl.push('LnSearchPage');
  }
}
