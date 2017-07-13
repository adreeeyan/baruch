import { Component, Input } from '@angular/core';
import { NavController } from "ionic-angular";
import { Novel } from "../../common/models/novel";

@Component({
  selector: 'ln-novel-list',
  templateUrl: 'ln-novel-list.html'
})
export class LnNovelList {

  @Input() novels: Array<Novel>;
  @Input() showEmpty: boolean = true;
  @Input() emptyMessage: string = "Nothing to show";

  constructor(private navCtrl: NavController) {
    console.log('Hello LnNovelList Component');
  }

  novelTapped(event, item) {
    this.navCtrl.push('LnDetailsTabs', item.id);
  }

  get isEmptyNovels() {
    return this.showEmpty && this.novels != null && this.novels.length == 0;
  }

}
