import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { File } from '@ionic-native/file';
import { Settings } from "../common/models/settings";

@Injectable()
export class SettingsService {
    DEFAULTSETTINGS: Settings;
    private SETTINGS: string = "settings";
    public settings: Settings;

    constructor(private storage: Storage, public file: File) {
        console.log("Hello Settings Service");
        this.DEFAULTSETTINGS = new Settings({
            startupScreen: "LnList",
            appStorageLocation: file.dataDirectory,
            epubLocation: file.externalRootDirectory
        });
        this.settings = this.DEFAULTSETTINGS;
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(this.SETTINGS)
                .then(settings => {
                    let availableSettings = settings || this.DEFAULTSETTINGS;
                    this.settings = availableSettings;
                    resolve(availableSettings);
                })
                .catch(err => {
                    // if no settings yet
                    // return the default once
                    resolve(this.DEFAULTSETTINGS);
                });
        });
    }

    set(settings) {
        this.storage.set(this.SETTINGS, settings);
        this.settings = settings;
    }
}
