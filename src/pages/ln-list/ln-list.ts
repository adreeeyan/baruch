import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Novel } from '../../common/models/novel';
import { NovelsService } from '../../providers/novels-service';
import { FilterParams } from "../../common/models/filter-params";
import { Status } from "../../common/models/status";

@IonicPage()
@Component({
  selector: 'page-ln-list',
  templateUrl: 'ln-list.html',
  styles: ['ln-list.scss']
})
export class LnList {
  novels: Array<Novel>;
  start: number;
  count: number;
  filterParams: FilterParams[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public novelsService: NovelsService,
    private modalCtrl: ModalController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnList');
    Promise.all([this.storage.get("checkedGenres"), this.storage.get("selectedStatus")])
      .then(values => {
        let checkedGenres = values[0];
        let selectedStatus = values[1];

        if (checkedGenres) {
          checkedGenres.forEach(genre => {
            this.filterParams.push(new FilterParams({
              searchKey: "Genre",
              searchValue: genre,
              isFull: true
            }));
          });
        }

        if (selectedStatus && selectedStatus != Status.ALL) {
          this.filterParams.push(new FilterParams({
            searchKey: "Status",
            searchValue: selectedStatus,
            isFull: true
          }));
        }

        this.resetNovelList();
      })
  }

  updateNovelList(): Promise<any> {
    return new Promise((resolve) => {
      this.novelsService
        .getNovels(this.start, this.count, "", this.filterParams)
        .subscribe((novels: Array<Novel>) => {
          this.novels = this.novels.concat(novels);
          this.start += novels.length;
          resolve();
        });
    });
  }

  resetNovelList() {
    this.novels = [];
    this.start = 0;
    this.count = 50;
    this.updateNovelList();
  }

  novelTapped(event, item) {
    this.navCtrl.push('LnDetailsTabs', item.id);
  }

  searchTapped(event, item) {
    this.navCtrl.push('LnSearchPage');
  }

  openFilterModal() {
    let filterModal = this.modalCtrl.create('LnNovelFilterModal');
    filterModal.onDidDismiss(filters => {
      if (!filters) {
        return;
      }

      this.filterParams = [];

      filters.genres.forEach(genre => {
        this.filterParams.push(new FilterParams({
          searchKey: "Genre",
          searchValue: genre,
          isFull: true
        }));
      });
      if (filters.status && filters.status != Status.ALL) {
        this.filterParams.push(new FilterParams({
          searchKey: "Status",
          searchValue: filters.status,
          isFull: true
        }));
      }

      this.resetNovelList();
    });
    filterModal.present();
  }
}
