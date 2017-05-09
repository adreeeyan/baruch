import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LnDetailsPage } from '../ln-details-page/ln-details-page';


/**
 * Generated class for the LnDetailsTabs page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
    this.detailsTab = LnDetailsPage;
    this.chaptersTab = LnDetailsPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDetailsTabs');
  }

}
