import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { FavoritesService } from '../../providers/favorites-service';

@IonicPage()
@Component({
  selector: 'page-ln-details-page',
  templateUrl: 'ln-details-page.html',
})
export class LnDetailsPage {
  novel: Novel;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public novelsService: NovelsService, private favoritesService: FavoritesService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnDetailsPage', this.novel);
    let id = this.navParams.data;
    this.novelsService.getNovel(id).subscribe((novel: Novel) => {
      console.log("ionVIewDidLoad", novel);
      this.novel = novel;
    })
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
    this.continueReading(1);
  }

  continueReading(chapter) {
    this.navCtrl.push('LnChapterPage', {
      novelId: this.novel.id,
      chapterNumber: chapter
    });
  }

  toggleFavorite() {
    if (this.novel) {
      this.favoritesService.toggleFavorite(this.novel.id);
    }

  }

  get isFavorite() {
    if (this.novel) {
      return this.favoritesService.isFavorite(this.novel.id);
    }

    return false;
  }
}
