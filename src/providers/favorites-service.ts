import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";
import { Novel } from "../common/models/novel";
@Injectable()
export class FavoritesService {
    favorites = [];

    constructor(private storage: Storage) {
        console.log("Hello Bookmarks Service");
        this.storage.get("favorites")
            .then(favorites => this.favorites = favorites || [])
            .catch(() => {
                this.favorites = [];
            })
    }

    addToFavorites(novel) {
        if (!this.isFavorite(novel)) {
            this.favorites.push(novel);
            this.save();
        }
    }

    isFavorite(novel) {
        return _.some(this.favorites, novel);
    }

    removeFromFavorites(novel) {
        if (this.isFavorite(novel)) {
            this.favorites = _.reject(this.favorites, novel);
            this.save();
        }
    }

    toggleFavorite(novel) {
        if (!this.isFavorite(novel)) {
            this.addToFavorites(novel);
        } else {
            this.removeFromFavorites(novel);
        }

        this.save();
    }
    save() {
        this.storage.set("favorites", this.favorites);
    }

    encodeQueryData(data) {
        let ret = [];
        for (let d in data) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
        return ret.join('&');
    }

    // retrieve the favorites
    getNovels(): Promise<Array<Novel>> {
        console.log("FavoritesService::getNovels");
        return new Promise((resolve) => {
            return this.storage.get("favorites")
                .then(favorites => {
                    resolve(favorites || [])
                })
                .catch(() => {
                    resolve([]);
                });
        });
    }
}
