import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import _ from "lodash";

import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { FavoritesService } from '../../providers/favorites-service';
import { LnLoadingController } from "../../common/ln-loading-controller";
import { RecentNovelsService } from "../../providers/recent-novels-service";
import { ChaptersService } from "../../providers/chapters-service";
import { LastReadChapterService } from '../../providers/last-read-chapter-service';

@IonicPage()
@Component({
  selector: 'page-ln-details-page',
  templateUrl: 'ln-details-page.html',
})
export class LnDetailsPage {
  novel: Novel;
  firstChapter: number;
  constructor(private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private novelsService: NovelsService,
    private favoritesService: FavoritesService,
    private recentNovelsService: RecentNovelsService,
    private chaptersService: ChaptersService,
    private lastReadChapterService: LastReadChapterService,
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
      .then(lastReadChapter => {
        this.continueReading(lastReadChapter);
      });
  }

  continueReading(lastReadChapter) {
    console.log("continueReading", lastReadChapter)
    this.app.getRootNav().push('LnChapterPage', {
      novelId: this.novel.id,
      chapterNumber: lastReadChapter.chapterNumber,
      percentageRead: lastReadChapter.percentageRead
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

  getFirstChapter(novelId): Promise<any> {
    return new Promise((resolve) => {
      if (this.firstChapter) {
        resolve(this.firstChapter)
      } else {
        this.novelsService.getNovelChapterList(novelId)
          .then((chapters) => {
            this.firstChapter = _(chapters).map('number').last();
            resolve(this.firstChapter);
          })
      }
    })
  }
  getLastReadChapter(): Promise<any> {
    console.log("LnDetailsPage::getLastReadChapter");

    return new Promise((resolve, reject) => {
      this.loadingCtrl.presentLoadingMessage();
      var novelId = this.novel.id.toString();
      this.getFirstChapter(novelId)
        .then(() => {
          return this.lastReadChapterService.getLastReadChapter(novelId)
        })
        .then((lastReadChapter) => {
          lastReadChapter.chapterNumber = Math.max(this.firstChapter, lastReadChapter.chapterNumber);
          resolve(lastReadChapter)
          this.loadingCtrl.hideLoadingMessage();
        })
        .catch(() => {
          this.loadingCtrl.hideLoadingMessage();
        })

    });
  }
}
