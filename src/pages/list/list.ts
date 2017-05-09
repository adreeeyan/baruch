import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LnDetailsPage } from '../ln-details-page/ln-details-page';
import { Novel } from '../../common/models/novel';
import { LnDetailsTabs } from '../ln-details-tabs/ln-details-tabs';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<Novel>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        id: i,
        title: 'Item ' + i,
        cover: "https://placehold.it/350x150",
        status: "ongoing",
        source: "http://toplightnovels.com/novel/the_380_utterances_of_kylin_zhang",
        datePublished: new Date("2017-05-08T13:44:53.416981"),
        lastUpdated: new Date("2017-05-08T13:44:53.416981"),
        chaptersCount: 1,
        authors: [
          {
            id: 2,
            name: "Nan Pai San Shu"
          }
        ],
        synopsis: "The 380 Utterances of Kylin Zhang summary is updating. Come visit TopLightNovels.com sometime to read the latest chapter of The 380 Utterances of Kylin Zhang. If you have any question about this novel, Please don't hesitate to contact us or translate team. Hope you enjoy it."
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(LnDetailsTabs, item.id);
  }
}
