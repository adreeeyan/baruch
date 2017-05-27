import { Component } from "@angular/core";
import { NavParams, ViewController, IonicPage, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { NovelsService } from "../../providers/novels-service";
import { Genre } from "../../common/models/genre";

@IonicPage()
@Component({
  selector: "ln-novel-filter-modal",
  templateUrl: "ln-novel-filter-modal.html",
})
export class LnNovelFilterModal {

  status: number = 0;
  genres: Genre[];

  constructor(public navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform,
    private storage: Storage,
    private novelsService: NovelsService) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnNovelFilterModal");
    // get all genres
    this.novelsService.getGenres()
      .subscribe(genres => {
        this.genres = genres;

        // get values from storage
        this.storage.get("checkedGenres")
            .then((genres) => {
              this.genres.forEach(genre => {
                genre.checked = genres == null || genres.indexOf(genre.id) != -1;
              });
            });
        });

      this.storage.get("selectedStatus")
          .then(val => this.status = val || 0);
  }

  get checkedGenres() {
    let checked: number[] = [];
    this.genres.forEach(genre => {
      if (genre.checked) {
        checked.push(genre.id);
      }
    });
    return checked;
  }

  save() {
    this.storage.set("checkedGenres", this.checkedGenres);
    this.storage.set("selectedStatus", this.status);
    this.viewCtrl.dismiss({
      genres: this.checkedGenres,
      status: this.status
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
