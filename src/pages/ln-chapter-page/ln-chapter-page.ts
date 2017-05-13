import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the LnChapterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "ln-chapter-page",
  templateUrl: "ln-chapter-page.html",
})
export class LnChapterPage {

  navDisplay: string = "none";
  chapterDetailsHeader: any;
  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chapterDetailsHeader = document.querySelector("page-ln-details-tabs ion-header");
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  // hide the tabs and header
  ionViewWillEnter() {
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "none";
    if (this.tabBarElement) this.tabBarElement.style.display = "none";
  }

  // show the tabs and header
  ionViewWillLeave() {
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "flex";
    if (this.tabBarElement) this.tabBarElement.style.display = "flex";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnChapterPage");
  }

  toggleNavBar() {
    this.navDisplay = this.navDisplay == "none" ? "flex" : "none";
  }

}
