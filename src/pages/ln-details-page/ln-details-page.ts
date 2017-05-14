import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Novel, EmptyNovel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';

@IonicPage()
@Component({
  selector: 'page-ln-details-page',
  templateUrl: 'ln-details-page.html',
})
export class LnDetailsPage {
  novel: Novel;
  constructor(public navCtrl: NavController, public navParams: NavParams, public novelsService: NovelsService) {
    this.novel = new EmptyNovel();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDetailsPage', this.novel);
    let id = this.navParams.data;
    this.novelsService.getNovel(id).subscribe((novel: Novel) => {
      console.log("ionVIewDidLoad", novel);
      this.novel = novel;
    })
  }
}
