import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
  selector: "ln-reader-settings-modal",
  templateUrl: "ln-reader-settings-modal.html",
})
export class LnReaderSettingsModal implements OnInit {

  fontSize: number = 13;
  brightness: number = 85;
  invertColors: boolean;
  horizontalScrolling: boolean;
  @ViewChild("result") result: ElementRef;

  constructor(public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.setFontSize(this.fontSize);
    this.setBrightness(this.brightness);
  }

  setBrightness(value) {
    this.result.nativeElement.style.opacity = value / 100;
  }

  setFontSize(value) {
    this.result.nativeElement.style.fontSize = value + "px";
  }

  dismiss() {
    let data = {
      fontSize: this.fontSize,
      brightness: this.brightness,
      invertColors: this.invertColors,
      horizontalScrolling: this.horizontalScrolling
    };
    this.viewCtrl.dismiss(data);
  }
}
