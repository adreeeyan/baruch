import { Injectable } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Diagnostic } from "@ionic-native/diagnostic";
import { AlertController } from "ionic-angular";

@Injectable()
export class NetworkServiceProvider {

  private _isConnected: boolean = true;
  private _isOpen: boolean = false;

  constructor(public alertCtrl: AlertController,
    private network: Network,
    private diagnostic: Diagnostic) {
    console.log("Hello NetworkServiceProvider Provider");

    this.network.onConnect().subscribe(() => {
      console.log("we got a network!");
      this._isConnected = true;
    });

    this.network.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
      this._isConnected = false;
    });
  }

  noConnection() {
    return !this._isConnected;
  }

  private showSettings() {
    if(this.diagnostic.switchToWifiSettings){
      this.diagnostic.switchToWifiSettings();
    }else{
      this.diagnostic.switchToSettings();
    }
  }

  showNetworkAlert() {
    if(this._isOpen){
      return;
    }
    let networkAlert = this.alertCtrl.create({
      title: "No Internet Connection",
      message: "Please check your internet connection.",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            this._isOpen = false;
          }
        },
        {
          text: "Open Settings",
          handler: () => {
            this._isOpen = false;
            networkAlert.dismiss().then(() => {
              this.showSettings();
            })
          }
        }
      ]
    });
    networkAlert.present();
    this._isOpen = true;
  }

}
