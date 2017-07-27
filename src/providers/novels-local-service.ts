import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";
import _ from "lodash";

import { Novel } from '../common/models/novel';
import { Transfer, TransferObject } from "@ionic-native/transfer";

@Injectable()
export class NovelsLocalService {

    private NOVELS: string = "novels";
    private coversDir: string = "covers";
    fileTransfer: TransferObject;

    constructor(private storage: Storage,
        private file: File,
        private transfer: Transfer, ) {
        console.log('Hello Novels Local Service');

        this.fileTransfer = this.transfer.create();
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

                    //save the image in data directory
                    this.saveImage(novel);
                });
        });
    }

    saveImage(novel: Novel): Promise<any> {
        let coversDir = this.file.dataDirectory;
        return new Promise((resolve, reject) => {
            // create the root folder for covers first
            this.createDir()
                .then(() => {
                    this.fileTransfer
                        .download(`/api/covers/${novel.cover}`, `${coversDir}${this.coversDir}/${novel.cover}`)
                        .then(entry => {
                            console.log("download image complete: ", entry.toURL());
                        })
                        .catch(err => {
                            console.log("error downloading image", err);
                        });
                })
                .catch(err => {
                    console.log("error creating root directory", err);
                });
        });
    }

    private createDir(): Promise<any> {
        let rootDir = this.file.dataDirectory;
        return new Promise((resolve, reject) => {
            this.file
                .checkDir(rootDir, this.coversDir)
                .then(() => {
                    // if directory exists, just do nothing
                    resolve();
                })
                .catch(() => {
                    // create the directory
                    this.file
                        .createDir(rootDir, this.coversDir, false)
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
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

    getNovel(novelId: string): Promise<Novel> {
        console.log("NovelsLocalService::getNovel", novelId);
        return new Promise((resolve, reject) => {
            this.get()
                .then(novels => {
                    // map novels
                    let found = _.find(novels, novel => novel.id == novelId);
                    if (found) {
                        resolve(found);
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
                    // remove the undefined
                    filtered = _.filter(filtered, novel => !!novel);
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
