import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import _ from "lodash";

import { Novel } from '../common/models/novel';

@Injectable()
export class NovelsLocalService {

    private NOVELS: string = "novels";

    constructor(private storage: Storage) {
        console.log('Hello Novels Local Service');
    }

    get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.NOVELS)
                .then(novels => {
                    resolve(novels || []);
                })
                .catch(() => {
                    // if no novels yet
                    // return blank
                    resolve([]);
                });
        });
    }

    set(novels) {
        this.storage.set(this.NOVELS, novels);
    }

    add(novel: Novel): Promise<any> {
        return new Promise((resolve, reject) => {
            // check first if novel in list already
            this.isInList(novel)
                .then(() => resolve())
                .catch(() => {
                    this.get()
                        .then((novels) => {
                            novels.push(novel);
                            this.set(novels);
                        });
                });
        });
    }

    remove(novel: Novel): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get()
                .then((novels) => {
                    _.novels.pull(novel);
                    this.set(novels);
                });
        });
    }

    isInList(novel): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get()
                .then(novels => {
                    let inList = _.some(novels, novel);
                    if (inList) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(() => {
                    reject();
                });
        });
    }

    getNovels(novelIds: number[]): Promise<Array<Novel>> {
        console.log("NovelsLocalService::getNovels", novelIds);
        return new Promise((resolve, reject) => {
            this.get()
                .then(novels => {
                    // map novels
                    let filtered = _.filter(novels, (novel: Novel) => {
                        return _.includes(novelIds, novel.id);
                    });
                    filtered = this.sortByOriginal(novelIds, filtered);
                    resolve(filtered);
                });
        });
    }

    // sorts the novels by original order in which it was passed to the function
    private sortByOriginal(novelIds, novels) {
        return _.map(novelIds, id => {
            return _.find(novels, novel => novel.id === id);
        });
    }
}
