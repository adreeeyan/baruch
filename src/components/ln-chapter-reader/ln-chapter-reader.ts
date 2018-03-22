import { Component, OnInit, ViewChild, Input, OnChanges, EventEmitter, Output, ElementRef } from '@angular/core';
import { Chapter } from "../../common/models/chapter";
import { NovelsService } from "../../providers/novels-service";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LnLoadingController } from "../../common/ln-loading-controller";
import { ChaptersService } from "../../providers/chapters-service";
import { ToastController } from "ionic-angular";
import { LastReadChapterService } from '../../providers/last-read-chapter-service';

@Component({
  selector: "ln-chapter-reader",
  templateUrl: "ln-chapter-reader.html"
})
export class LnChapterReader implements OnInit, OnChanges {

  content: string; // chapter content got from api
  contents: string[]; // content for the ion-slides
  @ViewChild("slidesHolder") slidesHolder: any;
  @ViewChild("contentHolder") contentHolder: any;
  @ViewChild("verticalContent") verticalContent: ElementRef;
  @Input() novelId: number;
  @Input() fontSize: number;
  @Input() horizontalScrolling: boolean;
  @Input() brightness: number;
  @Input() invertColors: boolean;
  @Input() autoScrollEnabled: boolean;
  @Input() autoScrollSpeed: number;
  autoScrollIntervalHolder: any;

  chapterValue: Chapter;

  previousPage: number = 0; // used for keeping track pages
  @Input() isFromNextChapter: boolean; // used to check if chapter navigated by swiping left
  @Input() isFromPreviousChapter: boolean;

  constructor(public novelsService: NovelsService,
    private screenOrientation: ScreenOrientation,
    private loadingCtrl: LnLoadingController,
    private chaptersService: ChaptersService,
    private lastReadChapterService: LastReadChapterService,
    private toastCtrl: ToastController) {
  }

  @Input()
  get chapter() {
    return this.chapterValue;
  }

  @Output() chapterChange = new EventEmitter();
  set chapter(val) {
    this.chapterValue = val;
    this.chapterChange.emit(this.chapterValue);
  }

  ngOnInit() {
    // set the orientation handler
    this.screenOrientation.onChange().subscribe(() => {
      this.contents = [];
      this.ngOnChanges();
    });

    var scrollContent: any = document.querySelector("ln-chapter-page ion-content .scroll-content");
    if (!this.horizontalScrolling) {
      scrollContent.addEventListener('scroll', ev => {
        var percentageRead = scrollContent.scrollTop / scrollContent.scrollHeight;
        this.lastReadChapterService.setLastReadChapter(this.novelId, this.chapterValue.number, percentageRead);
      }, )

    } else {
      scrollContent.removeEventListener('scroll');
    }
  }

  ngOnChanges() {
    if (this.fontSize == null ||
      this.novelId == null ||
      this.chapter == null) {
      return;
    }

    this.resetPages();

    // enable auto scrolling
    if (!this.horizontalScrolling &&
      this.autoScrollEnabled &&
      this.autoScrollSpeed) {
      this.enableAutoScroll();
    } else {
      this.disableAutoScroll();
    }
  }

  resetPages() {
    if (!this.chapter) return;
    this.content = this.formatText(this.chapter.content);

    var scrollContent: any = document.querySelector("ln-chapter-page ion-content .scroll-content");
    this.lastReadChapterService.getLastReadChapter(this.novelId).then((lastReadChapter) => {
      console.log("LnChapterReader::resetPages", lastReadChapter);

      if (!this.horizontalScrolling) {
        // update thingies for vertical scrolling
        this.verticalContent.nativeElement.style.fontSize = this.fontSize + "px";
        scrollContent.style.overflow = "auto";
        scrollContent.scrollTop = lastReadChapter.percentageRead * scrollContent.scrollHeight;

      } else {
        // update thingies for horizontal scrolling
        scrollContent.style.fontSize = this.fontSize + "px";
        setTimeout(() => {
          this.paginator();
          scrollContent.scrollTop = 0;
          scrollContent.style.overflow = "hidden";
          let page = 0;
          if (this.isFromNextChapter) {
            console.log("set page to last")
            page = this.contents.length - 1;
          } else if (this.isFromPreviousChapter) {
            console.log("set page to start")
            page = 0;
          } else {

            page = Math.floor(lastReadChapter.percentageRead * this.contents.length);
            console.log("set page to saved", this.contents.length, lastReadChapter.percentageRead, page);
          }

          setTimeout(() => { this.slidesHolder.slideTo(page, 0) }, 100);
        })
      }
    })

    // settings here should apply both in vertical and horizontal scrolling
    // update the brightness
    // filter should be applied in the ion-content, i don't know it wont work on the verticalContent div
    var ionContent: any = document.querySelector("ln-chapter-page ion-content");
    ionContent.style["-webkit-filter"] = `brightness(${this.brightness})`;
    if (this.invertColors) {
      ionContent.style["-webkit-filter"] = `brightness(${this.brightness}) invert(1)`;
    }
  }

  formatText(content: string) {
    // trim the content
    content = content.trim();
    // add an initial tab
    content = "&emsp;" + content;
    // replace the new lines with break plus tab
    content = content.replace(/\n\s*\n*/g, "<br><br>&emsp;");
    // add the title at the start of the page
    content = `<center><b>Content&nbsp;#${this.chapter.number}</b></center><br>` + content;
    return content;
  }

  paginator() {
    // split the words by whitespaces
    var words = this.content.split(/(\s|<br>)/g);
    // iterate each word
    var inner = ""; // holder
    words.forEach((word) => {
      // append to holder
      inner += `<span>${word} </span>`;
    });

    // set the container css
    var scrollContent: any = document.querySelector("ln-chapter-page ion-content .scroll-content");
    var container = this.contentHolder.nativeElement;
    container.style.fontSize = this.fontSize + "px";
    var paddingLeft = parseInt(getComputedStyle(scrollContent).paddingLeft.split("px")[0]);
    var paddingRight = parseInt(getComputedStyle(scrollContent).paddingRight.split("px")[0]);
    var paddingTop = parseInt(getComputedStyle(scrollContent).paddingTop.split("px")[0]);
    var paddingBottom = parseInt(getComputedStyle(scrollContent).paddingBottom.split("px")[0]);
    container.style.minWidth = (parseInt(getComputedStyle(scrollContent).width.split("px")[0]) - paddingLeft - paddingRight) + "px";
    container.style.maxWidth = (parseInt(getComputedStyle(scrollContent).width.split("px")[0]) - paddingLeft - paddingRight) + "px";
    container.style.minHeight = (parseInt(getComputedStyle(scrollContent).height.split("px")[0]) - paddingTop - paddingBottom) + "px";
    container.style.maxHeight = (parseInt(getComputedStyle(scrollContent).height.split("px")[0]) - paddingTop - paddingBottom) + "px";
    var excessLineHeight = (this.fontSize - 17) / 10;
    container.style.lineHeight = 1.6 - excessLineHeight;
    container.innerHTML = inner;

    // Make a pages list
    var pages = [""];

    // Iterate the spans in the container
    var spans = container.children;
    var i = 0;
    // while there is still a word in the container, migrate its word
    while (spans.length != 0) {
      var span: any = spans[i];
      // this means there is no more spans
      if (span == undefined) {
        this.removePreviousSiblings(spans[i - 1]);
        break;
      }

      // check if span fits in the container
      if (span.offsetHeight + span.offsetTop < container.offsetHeight + container.offsetTop) {
        // if it fits, append the span to the latest slide
        pages[pages.length - 1] += span.innerHTML;
        i++;
      } else {
        // if it doesn't, create a new slide and append the span there
        pages[pages.length] = span.innerHTML;

        // remove all the previous spans
        this.removePreviousSiblings(span);
        // go back to the first item in the container which is still alive
        i = 0;
      }
    };

    this.contents = pages;
  }

  removePreviousSiblings(el) {
    if (el.previousElementSibling) {
      this.removePreviousSiblings(el.previousElementSibling);
    }
    el.remove();
  }

  goToNextChapter() {
    // ionic has no native way in checking if the user swipped more than the number of slides
    // so for this we need to check if the previous page is the last page before executing this
    if (this.slidesHolder.isEnd() && this.previousPage == this.slidesHolder.length() - 1) {
      this.isFromNextChapter = false;
      this.isFromPreviousChapter = true;
      this.goToChapter(this.chapter.number + 1);
    }
  }

  goToPreviousChapter(evt) {
    // if first page, then dont do anything
    if (this.chapter.number <= 1) {
      return;
    }

    // ionic has no native way in checking if the user swipped more than the number of slides
    // so for this we need to check if the previous page is the first page before executing this
    // and also, ionSlidePrevStart doesn't fire when sliding at the beginning of the slide
    // hence, we also need a workaround for this
    // we need to get swiper-wrapper element and check how much translate3d on "x" it has
    // if it exceeds 30 then we will fire this function
    if (this.previousPage != 0 || evt.swipeDirection != "prev") return;
    let swiperWrapper: any = document.querySelector(".swiper-wrapper");
    // sample transform3d "translate3d(0px, 0px, 0px)"
    let transformX = parseInt(swiperWrapper.style.transform.substr(12).split(",")[0].replace("px", ""));
    if (transformX > 50) {
      this.isFromNextChapter = true;
      this.isFromPreviousChapter = false;
      this.goToChapter(this.chapter.number - 1);
    }
  }

  savePageNumber() {
    this.previousPage = this.slidesHolder.getActiveIndex();

    this.lastReadChapterService.setLastReadChapter(this.novelId, this.chapterValue.number, this.previousPage / this.slidesHolder.length());
  }

  goToChapter(number): Promise<any> {
    return new Promise((resolve) => {
      this.loadingCtrl.presentLoadingMessage("", true, this.invertColors);
      this.novelsService.getNovelChapter(this.novelId.toString(), number)
        .then((chapter: Chapter) => {
          this.chapter = chapter;
          this.markChapterAsRead();
          resolve();
          this.loadingCtrl.hideLoadingMessage();
        })
        .catch(err => {
          this.loadingCtrl.hideLoadingMessage();
          let toast = this.toastCtrl.create({
            message: "No chapter to show.",
            duration: 2000,
            position: "bottom",
            dismissOnPageChange: true,
            showCloseButton: true
          });
          toast.present();
        });
    });
  }

  goToNextPage(evt) {
    if (this.slidesHolder.isEnd()) {
      this.isFromNextChapter = false;
      this.isFromPreviousChapter = true;
      this.goToChapter(this.chapter.number + 1);
      return;
    }
    this.isFromPreviousChapter = false;
    this.slidesHolder.slideNext();
  }

  goToPrevPage(evt) {
    // if first page, then dont do anything
    if (this.chapter.number <= 1 && this.slidesHolder.isBeginning()) {
      return;
    }

    if (this.slidesHolder.isBeginning()) {
      this.isFromNextChapter = true;
      this.isFromPreviousChapter = false;
      this.goToChapter(this.chapter.number - 1);
      return;
    }

    this.isFromNextChapter = false;
    this.slidesHolder.slidePrev();
  }

  markChapterAsRead() {
    this.chaptersService
      .markAsRead(this.chapter.id)
      .then(() => console.log("MARKED AS READ", this.chapter.id))
      .catch((err) => console.log("UNABLE TO MARK AS READ", this.chapter.id));
  }

  enableAutoScroll() {

    // remove existing autoscroll
    this.disableAutoScroll();

    var scrollContent: any = document.querySelector("ln-chapter-page ion-content .scroll-content");
    this.autoScrollIntervalHolder = setInterval(() => {
      scrollContent.scrollTop += 1;
    }, this.autoScrollSpeed);
  }

  disableAutoScroll() {
    clearInterval(this.autoScrollIntervalHolder);
  }
}
