import { Component, OnInit, ViewChild, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { Chapter } from "../../common/models/chapter";
import { NovelsService } from "../../providers/novels-service";
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: "ln-chapter-reader",
  templateUrl: "ln-chapter-reader.html"
})
export class LnChapterReader implements OnInit, OnChanges {

  content: string; // chapter content got from api
  contents: string[]; // content for the ion-slides
  @ViewChild("slidesHolder") slidesHolder: any;
  @ViewChild("contentHolder") contentHolder: any;
  @ViewChild("verticalContent") verticalContent: any;
  @ViewChild("verticalContentProgress") verticalContentProgress: any;
  @Input() novelId: number;
  @Input() fontSize: number;
  @Input() horizontalScrolling: boolean;
  @Input() brightness: number;
  @Input() invertColors: number;
  chapterValue: Chapter;
  scrollContent: any;

  previousPage: number = 0; // used for keeping track pages
  @Input() isRenderingChapter: boolean = true; // used as a lock so that goToChapter cannot execute simultaneously

  constructor(public novelsService: NovelsService, private screenOrientation: ScreenOrientation) {
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
      this.resetPages();
    });
    if (!this.horizontalScrolling) {
      this.isRenderingChapter = false;
    }
    this.scrollContent = document.querySelector("ln-chapter-page ion-content .scroll-content");
  }

  ngOnChanges() {
    if (this.fontSize == null ||
      this.novelId == null ||
      this.chapter == null) {
      return;
    }
    this.resetPages();
  }

  resetPages() {
    if (!this.chapter) return;
    this.content = this.formatText(this.chapter.content);
    if (this.horizontalScrolling) {
      // update thingies for horizontal scrolling
      this.isRenderingChapter = true;
      this.scrollContent.style.fontSize = this.fontSize + "px";
      setTimeout(() => {
        this.paginator();
        this.scrollContent.scrollTop = 0;
        this.scrollContent.style.overflow = "hidden";
        this.isRenderingChapter = false;
      });
    } else {
      // update thingies for vertical scrolling
      this.verticalContent.nativeElement.style.fontSize = this.fontSize + "px";
      this.scrollContent.style.overflow = "auto";
      this.updateVerticalProgress();
    }

    // settings here should apply both in vertical and horizontal scrolling
    // update the brightness
    // filter should be applied in the ion-content, i don't know it wont work on the verticalContent div
    var ionContent: any = document.querySelector("ln-chapter-page ion-content");
    ionContent.style["-webkit-filter"] = `brightness(${this.brightness})`;
    if (this.invertColors) {
      ionContent.style["-webkit-filter"] = `brightness(${this.brightness}) invert()`;
    }
  }

  formatText(content: string) {
    // trim the content
    content = content.trim();
    // add an initial tab
    content = "&emsp;" + content;
    // replace the new lines with break plus tab
    content = content.replace(/\n/g, "<br>&emsp;");
    // add the title at the start of the page
    content = `<center><b>Chapter&nbsp;${this.chapter.number}</b></center><br>` + content;
    return content;
  }

  paginator() {
    // split the words by whitespaces
    var words = this.content.split(/\s/g);
    // iterate each word
    var inner = ""; // holder
    words.forEach((word) => {
      // append to holder
      inner += `<span>${word} </span>`;
    });

    // set the container css
    var container = this.contentHolder.nativeElement;
    container.style.fontSize = this.fontSize + "px";
    var paddingLeft = parseInt(getComputedStyle(this.scrollContent).paddingLeft.split("px")[0]);
    var paddingRight = parseInt(getComputedStyle(this.scrollContent).paddingRight.split("px")[0]);
    var paddingTop = parseInt(getComputedStyle(this.scrollContent).paddingTop.split("px")[0]);
    var paddingBottom = parseInt(getComputedStyle(this.scrollContent).paddingBottom.split("px")[0]);
    container.style.minWidth = (parseInt(getComputedStyle(this.scrollContent).width.split("px")[0]) - paddingLeft - paddingRight) + "px";
    container.style.maxWidth = (parseInt(getComputedStyle(this.scrollContent).width.split("px")[0]) - paddingLeft - paddingRight) + "px";
    container.style.minHeight = (parseInt(getComputedStyle(this.scrollContent).height.split("px")[0]) - paddingTop - paddingBottom) + "px";
    container.style.maxHeight = (parseInt(getComputedStyle(this.scrollContent).height.split("px")[0]) - paddingTop - paddingBottom) + "px";
    container.style.lineHeight = 2 + (this.fontSize <= 12 ? .5 : 0); // 12 below fonts needs higher line height
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
    if (this.slidesHolder.isEnd() && this.previousPage == this.slidesHolder.length() - 1 && !this.isRenderingChapter) {
      this.isRenderingChapter = true; // explicitly call here
      this.goToChapter(this.chapter.number + 1)
        .then(() => {
          // move to first slide
          this.slidesHolder.slideTo(0);
        });
    }
  }

  goToPreviousChapter(evt) {
    // ionic has no native way in checking if the user swipped more than the number of slides
    // so for this we need to check if the previous page is the first page before executing this
    // and also, ionSlidePrevStart doesn't fire when sliding at the beginning of the slide
    // hence, we also need a workaround for this
    // we need to get swiper-wrapper element and check how much translate3d on "x" it has
    // if it exceeds 30 then we will fire this function
    if (this.previousPage != 0 || evt.swipeDirection != "prev" || this.isRenderingChapter) return;
    let swiperWrapper: any = document.querySelector(".swiper-wrapper");
    // sample transform3d "translate3d(0px, 0px, 0px)"
    let transformX = parseInt(swiperWrapper.style.transform.substr(12).split(",")[0].replace("px", ""));
    if (transformX > 50) {
      this.isRenderingChapter = true; // explicitly call here
      // use setTimeout to wait for the content to go back to its position
      setTimeout(() => {
        this.goToChapter(this.chapter.number - 1)
          .then(() => {
            // move to first slide, last slide fires a bug when slided there
            this.slidesHolder.slideTo(0);
          });
      }, 500);
    }
  }

  savePageNumber() {
    this.previousPage = this.slidesHolder.getActiveIndex();
  }

  goToChapter(number): Promise<any> {
    return new Promise((resolve) => {
      this.isRenderingChapter = true;
      this.novelsService.getNovelChapter(this.novelId.toString(), number)
        .subscribe((chapter: Chapter) => {
          this.chapter = chapter;
          // fire on change
          this.resetPages();
          resolve();
        });
    });
  }

  goToNextPage(evt) {
    if (this.slidesHolder.isEnd()) {
      this.goToChapter(this.chapter.number + 1);
      return;
    }
    this.slidesHolder.slideNext();
  }

  goToPrevPage(evt) {
    if (this.slidesHolder.isBeginning()) {
      this.goToChapter(this.chapter.number - 1);
      return;
    }
    this.slidesHolder.slidePrev();
  }

  updateVerticalProgress() {
    // let scroll end
    setTimeout(() => {
      let progress = this.scrollContent.scrollTop / (this.scrollContent.scrollHeight - this.scrollContent.clientHeight);
      this.verticalContentProgress.nativeElement.style.transform = `translate3d(0px, 0px, 0px) scaleX(1) scaleY(${progress})`;
    }, 500);
  }
}
