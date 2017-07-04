import { Component } from '@angular/core';
import { ViewController, IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  templateUrl: 'ln-download-novel-chapters-popup.html',
})
export class LnDownloadNovelChaptersPopup {
  constructor(public viewCtrl: ViewController) { }

  close() {
    this.viewCtrl.dismiss();
  }
}
