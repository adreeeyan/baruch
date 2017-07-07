import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavParams, ViewController, IonicPage, Platform } from "ionic-angular";
import { ReaderSettingsService } from "../../providers/reader-settings-service";
import { ReaderSettings } from "../../common/models/reader-settings";

@IonicPage()
@Component({
  selector: "ln-reader-settings-modal",
  templateUrl: "ln-reader-settings-modal.html",
})
export class LnReaderSettingsModal {

  fontSize: number;
  _brightness: number;
  invertColors: boolean;
  horizontalScrolling: boolean;
  @ViewChild("result") result: ElementRef;
  @ViewChild("resultIonItem") resultIonItem: any; // some css cannot affect "result" viewChild

  constructor(public navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform,
    private readerSettingsService: ReaderSettingsService) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LnReaderSettingsModal");
    // get values from storage
    let settings = this.readerSettingsService.settings;
    this.fontSize = settings.fontSize;
    this._brightness = settings.brightness * 100;
    this.invertColors = settings.invertColors;
    this.horizontalScrolling = settings.horizontalScrolling;
    this.setFontSize(this.fontSize);
    this.setBrightness(this.brightness);
  }

  setBrightness(value) {
    this.resultIonItem._elementRef.nativeElement.style["-webkit-filter"] = `brightness(${this.brightness})`;
    if (this.invertColors) {
      this.resultIonItem._elementRef.nativeElement.style["-webkit-filter"] = `brightness(${this.brightness}) invert()`;
    }
  }

  get brightness() {
    return this._brightness / 100;
  }

  setFontSize(value) {
    this.result.nativeElement.style.fontSize = value + "px";
  }

  doInvertColors(value) {
    this.setBrightness(this.brightness);
  }

  save() {
    let data = new ReaderSettings({
      fontSize: this.fontSize,
      brightness: this.brightness,
      invertColors: this.invertColors,
      horizontalScrolling: this.horizontalScrolling
    });

    // save values to storage
    this.readerSettingsService.set(data);
    this.viewCtrl.dismiss(data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
