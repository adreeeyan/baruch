import { Injectable } from "@angular/core";
import * as PouchDB from "pouchdb";
import cordovaSqlitePlugin from "pouchdb-adapter-cordova-sqlite";
import { ReaderSettings } from "../common/models/reader-settings";

@Injectable()
export class ReaderSettingsService {
    private _db;
    DEFAULTSETTINGS: ReaderSettings;
    DOCID: string = "unique";

    constructor() {
        console.log("Hello ReaderSettings Service");
        this.DEFAULTSETTINGS = new ReaderSettings();
    }

    initDb() {
        PouchDB.plugin(cordovaSqlitePlugin);
        let windowCopy: any = window;
        if (!!windowCopy.cordova) {
            this._db = new PouchDB("settings.db", { adapter: "cordova-sqlite", location: "default" });
        } else {
            this._db = new PouchDB("settings.db");
        }
    }

    get(): Promise<any> {
        return new Promise((resolve) => {
            this._db
                .get(this.DOCID)
                .then((settings) => {
                    resolve(settings);
                })
                .catch((err) => {
                    // if no settings yet
                    // return the default once
                    resolve(this.DEFAULTSETTINGS);
                });
        });
    }

    set(settings: ReaderSettings): Promise<any> {
        return new Promise((resolve) => {
            settings._id = this.DOCID;
            this.get()
                .then(doc => {
                    // this is not a default, so we need to put with the rev
                    if(doc._rev){
                        settings._rev = doc._rev;
                    }else{
                        delete settings._rev;
                    }
                    this._set(settings, resolve);
                })
                .catch(() => {
                    this._set(settings, resolve);
                });;
        });
    }

    private _set(settings, resolve) {
        this._db
            .put(settings)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                resolve();
            });
    }
}
