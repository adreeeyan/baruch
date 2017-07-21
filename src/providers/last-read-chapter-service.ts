import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import _ from "lodash";

@Injectable()
export class LastReadChapterService {
    private _lastReadChapters: object;
    private LAST_READ_CHAPTER_STORAGE: string = "lastReadChapters";

    constructor(private storage: Storage) {
        console.log("Hello Last Read Chapters Service");

    }

    initialize() {

        return new Promise((resolve, reject) => {
            if (!this._lastReadChapters) {
                this.storage.get(this.LAST_READ_CHAPTER_STORAGE)
                    .then((lastReadChapters) => {
                        this._lastReadChapters = lastReadChapters || {};
                        resolve(this._lastReadChapters)
                    }).catch(reject);
            } else {
                resolve(this._lastReadChapters);
            }
        })


    }

    setLastReadChapter(novelId, chapterNumber, percentageRead = 0) {

        //overwrite old value
        this._lastReadChapters[novelId] = {
            chapterNumber,
            percentageRead
        }
        console.log("LastReadChapterService::setLastReadChapter", this._lastReadChapters[novelId], chapterNumber, percentageRead);
        this.storage.set(this.LAST_READ_CHAPTER_STORAGE, this._lastReadChapters);
    }

    getLastReadChapter(novelId): Promise<any> {
        console.log("LastReadChapterService::getLastReadChapter", novelId)
        return this.initialize().then(() => {
            return this._lastReadChapters[novelId] || {
                chapterNumber: 0,
                percentageRead: 0
            }
        }).catch(function () {
            console.log("failed");
        })

    }
}
