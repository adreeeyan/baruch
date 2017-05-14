import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
  selector: "ln-reader-settings-modal",
  templateUrl: "ln-reader-settings-modal.html",
})
export class LnReaderSettingsModal {

  fontSize: number = 13;
  brightness: number = 85;
  invertColors: boolean;
  horizontalScrolling: boolean;
  @ViewChild("result") result: ElementRef;
  @ViewChild("resultIonItem") resultIonItem: any; // some css cannot affect "result" viewChild

  constructor(public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LnReaderSettingsModal');
    setTimeout(() => {
      this.setFontSize(this.fontSize);
      this.setBrightness(this.brightness);
    }, 200);

  }

  setBrightness(value) {
    this.resultIonItem._elementRef.nativeElement.style.filter = `brightness(${value / 100})`;
    if(this.invertColors){
      this.resultIonItem._elementRef.nativeElement.style.filter = `brightness(${this.brightness / 100}) invert()`;      
    }
  }

  setFontSize(value) {
    this.result.nativeElement.style.fontSize = value + "px";
  }

  doInvertColors(value) {
    this.setBrightness(this.brightness);
  }

  save() {
    let data = {
      fontSize: this.fontSize,
      brightness: this.brightness / 100,
      invertColors: this.invertColors,
      horizontalScrolling: this.horizontalScrolling
    };
    this.viewCtrl.dismiss(data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
