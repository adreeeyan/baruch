import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ModalController } from "ionic-angular";
import { NovelsService } from "../../providers/novels-service";
import { Chapter } from "../../common/models/chapter";
import { StatusBar } from "@ionic-native/status-bar";

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
  settings: any;
  isRenderingChapter: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public novelsService: NovelsService,
    private platform: Platform,
    private statusBar: StatusBar,
    private modalCtrl: ModalController) {
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
    this.goToChapter(data.novelId, data.chapterNumber);
    this.novelId = data.novelId;
    this.settings = {
      fontSize: 14,
      brightness: 1,
      invertColors: false,
      horizontalScrolling: false
    };
  }

  toggleNavBar() {
    this.navDisplay = this.navDisplay == "none" ? "flex" : "none";
  }

  toggleStatusBar(show) {
    if (this.platform.is("mobile") ||
      this.platform.is("mobileweb") ||
      this.platform.is("phablet") ||
      this.platform.is("tablet")
    ) {
      show ? this.statusBar.show() : this.statusBar.hide();
    }
  }

  openSettingsModal() {
    this.toggleNavBar();
    let settingsModal = this.modalCtrl.create('LnReaderSettingsModal');
    settingsModal.onDidDismiss((settings) => this.settings = settings ? settings : this.settings);
    settingsModal.present();
  }

  goToChapter(novelId, chapterNumber){
    this.isRenderingChapter = true;
    this.novelsService.getNovelChapter(novelId, chapterNumber)
      .subscribe((chapter: Chapter) => {
        this.chapter = chapter;
        this.isRenderingChapter = false;
      });
  }

  nextChapter(){
    this.toggleNavBar();
    this.goToChapter(this.novelId, this.chapter.number + 1);
  }

  prevChapter(){
    this.toggleNavBar();
    this.goToChapter(this.novelId, this.chapter.number - 1);
  }

  get isHorizontalScrolling(){
    return (this.settings && this.settings.horizontalScrolling) ? "navbar-toggler navbar-toggler-center" : "navbar-toggler navbar-toggler-full";
  }
}
