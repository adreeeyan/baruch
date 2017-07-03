import { Component, Input } from '@angular/core';
import { NavController } from "ionic-angular";
import { Novel } from "../../common/models/novel";

@Component({
  selector: 'ln-novel-list',
  templateUrl: 'ln-novel-list.html'
})
export class LnNovelList {

  @Input() novels: Array<Novel>;

  constructor(private navCtrl: NavController) {
    console.log('Hello LnNovelList Component');
  }

  novelTapped(event, item) {
    this.navCtrl.push('LnDetailsTabs', item.id);
  }

}
