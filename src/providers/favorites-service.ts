import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";
import { Novel } from "../common/models/novel";
import { NovelsLocalService } from "./novels-local-service";
@Injectable()
export class FavoritesService {
    favorites = [];
    private FAVORITES: string = "favorites";

    constructor(private storage: Storage, private novelsLocalService: NovelsLocalService) {
        console.log("Hello Favorites Service");
        this.storage.get(this.FAVORITES)
            .then(favorites => this.favorites = favorites || [])
            .catch(() => {
                this.favorites = [];
            })
    }

    addToFavorites(novel) {
        if (!this.isFavorite(novel)) {
            // save local data
            this.novelsLocalService.add(novel);
            // save the id
            this.favorites.push(novel.id);
            this.save();
        }
    }

    isFavorite(novel) {
        return _.includes(this.favorites, novel.id);
    }

    removeFromFavorites(novel) {
        if (this.isFavorite(novel)) {
            this.favorites = _.without(this.favorites, novel.id);
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
        this.storage.set(this.FAVORITES, this.favorites);
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
            return this.storage.get(this.FAVORITES)
                .then(favorites => {
                    this.novelsLocalService
                        .getNovels(favorites)
                        .then(novels => {
                            resolve(novels)
                        });
                })
                .catch(() => {
                    resolve([]);
                });
        });
    }
}
