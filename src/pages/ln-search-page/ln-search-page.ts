import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { LnLoadingController } from "../../common/ln-loading-controller";

@IonicPage()
@Component({
    selector: 'page-ln-search-page',
    templateUrl: 'ln-search-page.html',
    styles: ['ln-search-page.scss']
})
export class LnSearchPage {
    @ViewChild("search") search: any;
    novels: Array<Novel>;
    start: number;
    count: number;
    searchValue: string = "";
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public novelsService: NovelsService,
        private loadingController: LnLoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LnSearchPage');
        this.start = 0;
        this.count = 50;

        // setTimeout(() => this.search.setFocus(), 500)
    }

    updateNovelList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.novelsService
                .getNovels(this.start, this.count, this.searchValue)
                .subscribe((novels: Array<Novel>) => {
                    this.novels = this.novels.concat(novels);
                    this.start += novels.length;
                    resolve();
                }, (error) => {
                    resolve();
                });
        });
    }

    searchNovels(keyCode): any {
        console.log("LnSearchPage.searchNovels", keyCode);
        // if "enter" key isn't pressed, do not search
        if(keyCode != 13){
            return;
        }
        this.start = 0;
        return new Promise((resolve, reject) => {
            this.loadingController.presentLoadingMessage();
            this.novelsService
                .getNovels(this.start, this.count, this.searchValue)
                .subscribe((novels: Array<Novel>) => {
                    this.novels = novels;
                    this.start += novels.length;
                    this.loadingController.hideLoadingMessage();
                    resolve();
                }, (error) => {
                    resolve();
                    this.loadingController.hideLoadingMessage();
                });
        });
    }
}
