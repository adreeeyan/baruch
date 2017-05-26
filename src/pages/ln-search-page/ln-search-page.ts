import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard } from 'ionic-angular';
import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';

@IonicPage()
@Component({
    selector: 'page-ln-search-page',
    templateUrl: 'ln-search-page.html',
    styles: ['ln-search-page.scss']
})
export class LnSearchPage {
    novels: Array<Novel>;
    @ViewChild("search") search: any;
    start: number;
    count: number;
    searchValue: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public novelsService: NovelsService, public keyboard: Keyboard) {
        this.keyboard.onClose(this.searchNovels.bind(this));
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LnSearchPage');
        this.novels = [];
        this.start = 0;
        this.count = 50;

        // setTimeout(() => this.search.setFocus(), 500)
    }

    updateNovelList(): Promise<any> {
        return new Promise((resolve) => {
            this.novelsService
                .getNovels(this.start, this.count, this.searchValue)
                .subscribe((novels: Array<Novel>) => {
                    this.novels = this.novels.concat(novels);
                    this.start += novels.length;
                    resolve();
                });
        });
    }

    searchNovels(): any {
        console.log("LnSearchPage.searchNovels");
        this.start = 0;
        return new Promise((resolve) => {
            this.novelsService
                .getNovels(this.start, this.count, this.searchValue)
                .subscribe((novels: Array<Novel>) => {
                    this.novels = novels;
                    this.start += novels.length;
                    resolve();
                });
        });
    }


    novelTapped(event, item) {
        this.navCtrl.push('LnDetailsTabs', item.id);
    }

}
