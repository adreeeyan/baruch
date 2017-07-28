import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";

@IonicPage()
@Component({
  selector: 'page-ln-about',
  templateUrl: 'ln-about.html',
  styles: ['ln-about.scss']
})
export class LnAbout {

  version: string;

  constructor(private appVersion: AppVersion) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnAbout");
    this.appVersion.getVersionNumber().then(version => {
      this.version = version;
    });
  }

  openInBrowser(evt, url){
    window.open(url, "_system", "location=yes");
    evt.preventDefault();
    return false;
  }
}
