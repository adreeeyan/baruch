import { Component } from '@angular/core';
import { ViewController, IonicPage } from "ionic-angular";
import _ from "lodash";

@IonicPage()
@Component({
  selector: 'popup-ln-download-novel-chapters',
  templateUrl: 'ln-download-novel-chapters-popup.html',
})
export class LnDownloadNovelChaptersPopup {
  rangeValue: any = {};
  chapters = [];

  constructor(public viewCtrl: ViewController) {
    this.chapters = this.viewCtrl.data.chapters;
    this.rangeValue.upper = this.chapters.length;
    this.rangeValue.lower = 1;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  checkAll() {
    _.each(this.chapters, chapter => chapter.checked = true);
  }

  uncheckAll() {
    _.each(this.chapters, chapter => {
      chapter.checked = false;
    });
  }

  rangeUpdate(value){
    let chapters = this.chapters;
    let lowerBoundaryLow = 0;
    let lowerBoundaryUp = value.lower - 1;
    let upperBoundaryLow = value.upper;
    let upperBoundaryUp = this.chapters.length;

    // check those in the range
    let inner = chapters.slice(value.lower - 1, value.upper - 1);
    _.each(inner, chapter => {
      chapter.checked = true
    });

    // uncheck those outside the range
    let outer = chapters.slice(lowerBoundaryLow, lowerBoundaryUp).concat(chapters.slice(upperBoundaryLow, upperBoundaryUp))
    _.each(outer, chapter => {
      chapter.checked = false;
    });
  }
}
