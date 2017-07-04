import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Novel } from "../../common/models/novel";

@IonicPage()
@Component({
  selector: 'page-ln-download-novel',
  templateUrl: 'ln-download-novel.html',
})
export class LnDownloadNovelPage {
  novel: Novel;
  chapterDetailsHeader: any;
  tabBarElement: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController) {
    this.chapterDetailsHeader = document.querySelector("page-ln-details-tabs ion-header");
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  ionViewWillEnter() {
    // hide the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "none";
    if (this.tabBarElement) this.tabBarElement.style.display = "none";
  }

  ionViewWillLeave() {
    // show the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "flex";
    if (this.tabBarElement) this.tabBarElement.style.display = "flex";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDownloadNovelPage');
  }

  selectPopover(evt) {
    let popover = this.popoverCtrl.create("LnDownloadNovelChaptersPopup");
    popover.present({
      ev: evt
    });
  }

}
