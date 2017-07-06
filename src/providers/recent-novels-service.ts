import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";
import { Novel } from "../common/models/novel";
import { NovelsLocalService } from "./novels-local-service";
@Injectable()
export class RecentNovelsService {
    recent = [];
    private RECENT: string = "recent";
    private MAX: number = 20;

    constructor(private storage: Storage, private novelsLocalService: NovelsLocalService) {
        console.log("Hello RecentNovels Service");
        this.storage.get(this.RECENT)
            .then(recent => this.recent = recent || [])
            .catch(() => {
                this.recent = [];
            })
    }

    get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.RECENT)
                .then(recent => {
                    resolve(recent || []);
                })
                .catch(() => {
                    // if no recent yet
                    // return blank
                    resolve([]);
                });
        });
    }

    set(recent) {
        this.storage.set(this.RECENT, recent);
    }

    add(novel: Novel): Promise<any> {
        // get all the recent novels and remove the novel before adding it
        // so that it will not have a duplicate and put it in the top
        return new Promise((resolve, reject) => {
            this.get()
                .then(recents => {
                    _.pull(recents, novel.id);
                    recents.unshift(novel.id);

                    // check if maximum items is reached
                    if (recents.length > this.MAX) {
                        recents.pop();
                    }

                    // save it
                    this.set(recents);

                    // save local data
                    this.novelsLocalService.add(novel);

                    resolve();
                });
        });
    }

    // retrieve the recents
    getNovels(): Promise<Array<Novel>> {
        console.log("RecentNovelsService::getNovels");
        return new Promise((resolve) => {
            this.get()
                .then(recent => {
                    this.novelsLocalService
                        .getNovels(recent)
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
