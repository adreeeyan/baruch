import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NovelsService } from "../../providers/novels-service";
import { Chapter } from "../../common/models/chapter";

@IonicPage()
@Component({
  selector: "ln-chapter-list",
  templateUrl: "ln-chapter-list.html",
})
export class LnChapterListPage {
  chapters: Chapter[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public novelService: NovelsService) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnChapterListPage");
    let id = this.navParams.data;
    this.novelService
      .getNovelChapterList(id)
      .subscribe((chapters: Chapter[]) => this.chapters = chapters);
  }

  openChapter(chapterNumber) {
    this.navCtrl.push('LnChapterPage', {
      novelId: this.navParams.data,
      chapterNumber: chapterNumber
    });
  }

}
