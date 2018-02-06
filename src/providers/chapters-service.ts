import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";

@Injectable()
export class ChaptersService {
    private _readChapters: Array<number> = null;
    private READCHAPTERS: string = "readChapters";

    constructor(private storage: Storage) {
        console.log("Hello Chapters Service");
    }

    getAllReadChapters() {
        return new Promise((resolve, reject) => {
            if(!_.isNull(this._readChapters)){
                resolve(this._readChapters);
                return;
            }
            this.storage.get(this.READCHAPTERS)
                .then(chapters => {
                    this._readChapters = chapters || [];
                    resolve(chapters);
                })
                .catch(() => {
                    resolve([]);
                });
        });
    }

    isRead(chapter): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getAllReadChapters()
                .then(readChapters => {
                    var isRead = _.includes(readChapters, chapter);
                    if (isRead) {
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

    markAsRead(chapter): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isRead(chapter)
                .then(() => {
                    // chapter is already read
                    reject();
                })
                .catch(() => {
                    // add chapter to read
                    this._readChapters.push(chapter);
                    this.save();
                    resolve()
                });
        });
    }

    save() {
        this.storage.set(this.READCHAPTERS, this._readChapters);
    }
}
