import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
@Injectable()
export class ReaderSettingsService {
    KEY: string = "readerSettings";
    DEFAULTSETTINGS: any;
    constructor(private storage: Storage) {
        console.log('Hello ReaderSettings Service');
        this.DEFAULTSETTINGS = {
            fontSize: 18,
            brightness: 1,
            invertColors: false,
            horizontalScrolling: false
        };
    }

    get(): Promise<any> {
        return new Promise((resolve) => {
            this.storage
                .get(this.KEY)
                .then((settings) => {
                    // check if no settings yet
                    // return the default once
                    if (!settings) {
                        resolve(this.DEFAULTSETTINGS);
                    } else {
                        resolve(settings);
                    }
                });
        });
    }

    set(settings) {
        this.storage.set(this.KEY, settings);
    }
}
