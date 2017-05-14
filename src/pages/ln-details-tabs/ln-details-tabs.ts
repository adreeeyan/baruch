import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ln-details-tabs',
  templateUrl: 'ln-details-tabs.html',
})
export class LnDetailsTabs {
  detailsTab: any;
  chaptersTab: any;
  params: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params = this.navParams.data;
    this.detailsTab = 'LnDetailsPage';
    this.chaptersTab = 'LnChapterListPage';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDetailsTabs');
  }

}
