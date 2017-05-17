import { Injectable } from "@angular/core";
import * as PouchDB from "pouchdb";
import cordovaSqlitePlugin from "pouchdb-adapter-cordova-sqlite";

@Injectable()
export class ChaptersService {
    private _db;

    constructor() {
        console.log("Hello Chapters Service");
    }

    initDb() {
        PouchDB.plugin(cordovaSqlitePlugin);
        let windowCopy: any = window;
        if (!!windowCopy.cordova) {
            this._db = new PouchDB("chapters.db", { adapter: "cordova-sqlite", location: "default" });
        } else {
            this._db = new PouchDB("chapters.db");
        }
    }

    get(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this._db
                .get(id.toString())
                .then((chapter) => {
                    resolve(chapter);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    isRead(chapter): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get(chapter.id)
                .then((chapter) => {
                    if (chapter.isRead) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    markAsRead(chapter): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get(chapter.id)
                .then(doc => {
                    if (doc.isRead) {
                        resolve();
                        return;
                    }
                    doc.isRead = true;
                    this._put(doc, resolve, reject);
                })
                .catch((err) => {
                    // not in db yet
                    chapter.isRead = true;
                    this._put(chapter, resolve, reject);
                });
        });
    }

    private _put(chapter, resolve, reject) {
        chapter._id = chapter.id.toString();
        this._db
            .put(chapter)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject();
            });
    }
}
