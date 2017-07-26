import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { SettingsService } from "../../providers/settings-service";
import { Settings } from "../../common/models/settings";

@IonicPage()
@Component({
  selector: 'page-ln-settings',
  templateUrl: 'ln-settings.html',
  styles: ['ln-settings.scss']
})
export class LnSettings {

  settings: Settings;

  constructor(private settingsService: SettingsService,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnSettings", this.settingsService.settings);
    this.settings = this.settingsService.settings;
  }

  changeAppStorageLocation() {
    this.chooseFolder(this.settings.appStorageLocation)
      .then((location) => {
        this.settings.appStorageLocation = location;
      })
      .catch(() => {
      });
  }

  changeEpubLocation() {

    this.chooseFolder(this.settings.epubLocation)
      .then((location) => {
        this.settings.epubLocation = location;
      })
      .catch(() => {
      });
  }

  chooseFolder(startupPath = ""): Promise<any> {
    startupPath = startupPath || "";
    startupPath = startupPath.replace("file:///", "");
    return new Promise((resolve, reject) => {
      (<any>window).OurCodeWorld.Filebrowser.folderPicker.single({
        success: (data) => {
          if (!data.length) {
            reject();
          }
          let dir = data[0] + "/";
          console.log("Choosen directory: ", dir);
          resolve(dir);
        },
        error: (err) => {
          console.log("Failure opening directory", err);
          reject();
        },
        startupPath: startupPath
      });
    });
  }

  save() {
    console.log("saving", this.settings);
    this.settingsService.set(this.settings);
    this.toastCtrl.create({
      message: "Your changes have been saved.",
      position: "bottom",
      duration: 3000,
      showCloseButton: true
    }).present();
  }
}
