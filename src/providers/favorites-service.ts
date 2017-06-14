import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";
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

    addToFavorites(novelId) {
        if (!this.isFavorite(novelId)) {
            this.favorites.push(novelId);
            this.save();
        }
    }

    isFavorite(novelId) {
        return _.includes(this.favorites, novelId);
    }

    removeFromFavorites(novelId) {
        if (this.isFavorite(novelId)) {
            this.favorites = _.without(this.favorites, novelId);
            this.save();
        }
    }

    toggleFavorite(novelId) {
        if (!this.isFavorite(novelId)) {
            this.addToFavorites(novelId);
        } else {
            this.removeFromFavorites(novelId);
        }

        this.save();
    }
    save() {
        this.storage.set("favorites", this.favorites);
    }
}
