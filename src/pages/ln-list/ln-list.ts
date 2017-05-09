import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { LnDetailsTabs } from '../ln-details-tabs/ln-details-tabs';

/**
 * Generated class for the LnList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ln-list',
  templateUrl: 'ln-list.html',
  styles: ['ln-list.scss']
})
export class LnList {
  novels: Array<Novel>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public novelsService: NovelsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnList');
    this.novelsService.getNovels().subscribe((novels: Array<Novel>) => {
      console.log("ionVIewDidLoad", novels);
      this.novels = novels;
    });
  }

  novelTapped(event, item) {
    this.navCtrl.push(LnDetailsTabs, item.id);
  }

}
