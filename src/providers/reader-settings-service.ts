import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ReaderSettings } from "../common/models/reader-settings";

@Injectable()
export class ReaderSettingsService {
    DEFAULTSETTINGS: ReaderSettings;
    private READERSETTINGS: string = "readerSettings";

    constructor(private storage: Storage) {
        console.log("Hello ReaderSettings Service");
        this.DEFAULTSETTINGS = new ReaderSettings();
    }

    get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.READERSETTINGS)
                .then(settings => {
                    resolve(settings || this.DEFAULTSETTINGS);
                })
                .catch(() => {
                    // if no settings yet
                    // return the default once
                    resolve(this.DEFAULTSETTINGS);
                });
        });
    }

    set(settings) {
        this.storage.set(this.READERSETTINGS, settings);
    }
}
