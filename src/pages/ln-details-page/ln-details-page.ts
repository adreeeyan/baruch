import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import _ from "lodash";

import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { FavoritesService } from '../../providers/favorites-service';
import { LnLoadingController } from "../../common/ln-loading-controller";
import { RecentNovelsService } from "../../providers/recent-novels-service";
import { ChaptersService } from "../../providers/chapters-service";

@IonicPage()
@Component({
  selector: 'page-ln-details-page',
  templateUrl: 'ln-details-page.html',
})
export class LnDetailsPage {
  novel: Novel;
  constructor(private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private novelsService: NovelsService,
    private favoritesService: FavoritesService,
    private recentNovelsService: RecentNovelsService,
    private chaptersService: ChaptersService,
    private loadingCtrl: LnLoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDetailsPage', this.novel);
    this.loadingCtrl.presentLoadingMessage();
    let id = this.navParams.data;
    this.novelsService.getNovel(id).then((novel: Novel) => {
      console.log("ionViewDidLoad", novel);
      this.novel = novel;
      this.recentNovelsService.add(novel);
      this.loadingCtrl.hideLoadingMessage();
    });
  }

  get formattedSynopsisText() {
    if (this.novel) {
      let content = this.novel.synopsis.trim();
      content = '&emsp;' + content.replace(/\n/g, "<br>&emsp;");
      return content;
    }
    return "";
  }

  get formattedGenre() {
    if (this.novel) {
      let genres = this.novel.genres.map(genre => genre.name)
      return genres.join(", ");
    }
    return "";
  }

  startReading() {
    this.getLastReadChapter()
      .then(chapter => {
        let chapterNumber = chapter == null ? 1 : chapter.number;
        this.continueReading(chapterNumber);
      });
  }

  continueReading(chapter) {
    this.app.getRootNav().push('LnChapterPage', {
      novelId: this.novel.id,
      chapterNumber: chapter
    });
  }

  download() {
    this.app.getRootNav().push('LnDownloadNovelPage', this.novel);
  }

  toggleFavorite() {
    if (this.novel) {
      this.favoritesService.toggleFavorite(this.novel);
    }

  }

  get isFavorite() {
    if (this.novel) {
      return this.favoritesService.isFavorite(this.novel);
    }

    return false;
  }

  getLastReadChapter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingCtrl.presentLoadingMessage();
      // get all chapters from novel
      this.novelsService
        .getNovelChapterList(this.novel.id.toString())
        .then(chapters => {
          // check chapter if isRead already starting from the top
          // if its already read, then that chapter is the latest
          chapters = chapters.reverse();
          this.chaptersService
            .getAllReadChapters()
            .then(readChapters => {
              let lastReadChapter = _.findLast(chapters, chapter => {
                return _.includes(readChapters, chapter.id);
              });
              resolve(lastReadChapter);
              this.loadingCtrl.hideLoadingMessage();
            });
        });
    });
  }
}
