import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { NovelsService } from "../../providers/novels-service";
import { Chapter } from "../../common/models/chapter";
import { StatusBar } from "@ionic-native/status-bar";

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
  chapter: Chapter;
  novelId: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public novelsService: NovelsService,
    private platform: Platform,
    private statusBar: StatusBar) {
    this.chapterDetailsHeader = document.querySelector("page-ln-details-tabs ion-header");
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  ionViewWillEnter() {
    // hide the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "none";
    if (this.tabBarElement) this.tabBarElement.style.display = "none";

    // hide status bar
    this.toggleStatusBar(false);
  }

  ionViewWillLeave() {
    // show the tabs and header    
    if (this.chapterDetailsHeader) this.chapterDetailsHeader.style.display = "flex";
    if (this.tabBarElement) this.tabBarElement.style.display = "flex";

    // show status bar
    this.toggleStatusBar(true);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnChapterPage");
    let data = this.navParams.data;
    this.novelsService.getNovelChapter(data.novelId, data.chapterNumber)
      .subscribe((chapter: Chapter) => this.chapter = chapter);
    this.novelId = data.novelId;
  }

  toggleNavBar() {
    this.navDisplay = this.navDisplay == "none" ? "flex" : "none";
    this.toggleStatusBar();
  }

  toggleStatusBar(show = undefined) {
    if (this.platform.is("mobile") ||
      this.platform.is("mobileweb") ||
      this.platform.is("phablet") ||
      this.platform.is("tablet")
    ) {
      if(show === undefined){
        this.statusBar.isVisible ? this.statusBar.hide() : this.statusBar.show();
      }else if(show){
        this.statusBar.show()
      }else{
        this.statusBar.hide()
      }
    }
  }

}
