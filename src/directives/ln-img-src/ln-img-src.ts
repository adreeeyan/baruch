import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { File } from "@ionic-native/file";

@Directive({
  selector: '[ln-img-src]' // Attribute selector
})
export class LnImgSrcDirective implements OnInit, OnChanges {

  @Input('ln-img-src') imageSrc: string;

  constructor(private el: ElementRef, public file: File) {
    console.log('Hello LnImgSrcDirective Directive');
  }

  ngOnInit() {
    this.reset();
  }

  ngOnChanges() {
    this.reset();
  }

  reset() {
    let self = this;

    // check if image source is null
    if(this.imageSrc == null){
      return;
    }

    let apiSource = "/api";
    this.el.nativeElement.src = this.file.dataDirectory ? `${this.file.dataDirectory}covers/${this.imageSrc}` : `${apiSource}/covers/${this.imageSrc}`;
    this.el.nativeElement.onerror = function () {
      this.onerror = null;
      this.src = `${apiSource}/covers/${self.imageSrc}`;
    };
  }

}
