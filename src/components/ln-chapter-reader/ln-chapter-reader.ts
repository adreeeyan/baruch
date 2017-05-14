import { Component, OnInit, ViewChild, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { Chapter } from "../../common/models/chapter";
import { NovelsService } from "../../providers/novels-service";
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the LnChapterReader component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "ln-chapter-reader",
  templateUrl: "ln-chapter-reader.html"
})
export class LnChapterReader implements OnInit, OnChanges {

  content: string; // chapter content got from api
  contents: string[]; // content for the ion-slides
  linePad: number; // extra vertical height around the fonts
  slidesHolderWidth: number; // set the variable on init so that it wont change upon update
  slidesHolderHeight: number; // set the variable on init so that it wont change upon update
  @ViewChild("slidesHolder") slidesHolder: any;
  @ViewChild("contentHolder") contentHolder: any;
  @ViewChild("verticalContent") verticalContent: any;
  @Input() novelId: number;
  @Input() fontSize: number;
  @Input() horizontalScrolling: boolean;
  @Input() brightness: number;
  @Input() invertColors: number;
  chapterValue: Chapter;

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

  get pageHeight() {
    return this.slidesHolderHeight - this.linePad;
  }

  get pageWidth() {
    return this.slidesHolderWidth;
  }

  ngOnInit() {
    this.slidesHolderHeight = this.slidesHolder._elementRef.nativeElement.offsetHeight;
    this.slidesHolderWidth = this.slidesHolder._elementRef.nativeElement.offsetWidth;
    // set the orientation handler
    this.screenOrientation.onChange().subscribe(() => {
      this.contents = [];
      this.resetPages();
    });
    if (!this.horizontalScrolling) {
      this.isRenderingChapter = false;
    }
  }

  ngOnChanges() {
    if (this.fontSize == null ||
      this.novelId == null ||
      this.chapter == null) {
      return;
    }
    if (this.horizontalScrolling) {
      // set the sizes
      this.linePad = this.fontSize + this.fontSize * .75; // extra vertical height around the fonts
      this.contentHolder.nativeElement.style.fontSize = this.fontSize + "px";
    }
    this.resetPages();
  }

  resetPages() {
    if (!this.chapter) return;
    this.content = this.formatText(this.chapter.content);
    var scrollContent: any = document.querySelector("ln-chapter-page ion-content .scroll-content");
    if (this.horizontalScrolling) {
      // update thingies for horizontal scrolling
      this.isRenderingChapter = true;
      setTimeout(() => {
        this.breakPages().then(() => this.isRenderingChapter = false);
      }, 0);
      scrollContent.style.overflow = "hidden";
    } else {
      // update thingies for vertical scrolling
      this.verticalContent.nativeElement.style.fontSize = this.fontSize + "px";
      scrollContent.style.overflow = "auto";
    }

    // settings here should apply both in vertical and horizontal scrolling
    // update the brightness
    // filter should be applied in the ion-content, i don't know it wont work on the verticalContent div
    var ionContent: any = document.querySelector("ln-chapter-page ion-content");
    ionContent.style["-webkit-filter"] = `brightness(${this.brightness})`;    
    if(this.invertColors){
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

  breakPages(): Promise<any> {
    return new Promise((resolve) => {
      // this is for reusing the component
      // empty the contentHolder
      this.contentHolder.nativeElement.innerHTML = "";
      this.contents = [];

      let text = this.content; // gets the text, which should be displayed later on
      let textArray = text.split(/\s/); // makes the text to an array of words
      var currentPage = this.createPage(); // creates the first page
      textArray.forEach(textValue => { // loops through all the words
        let success = this.appendToLastPage(textValue); // tries to fill the word in the last page
        if (!success) { // checks if word could not be filled in last page

          // attach the current page to the slides before creating another page
          this.contents.push(currentPage.innerHTML);

          currentPage = this.createPage(); // create new empty page
          textValue = textValue.replace(/^((<br>)|(&emsp;))+/g, "");// this will be the first word in the page, so ltrim it
          this.appendToLastPage(textValue); // fill the word in the new last element
        }
      });
      resolve();
    });
  }

  createPage() {
    let page = document.createElement("div"); // creates new html element
    page.setAttribute("class", "page"); // appends the class "page" to the element
    page.style.width = this.pageWidth + "px"; // set the page width
    page.style.height = this.pageHeight + "px"; // set the page height
    this.contentHolder.nativeElement.appendChild(page); // appends the element to the container for all the pages
    return page;
  }

  appendToLastPage(word) {
    let pagesContainer = this.contentHolder.nativeElement.getElementsByClassName("page");
    let page: any = pagesContainer[pagesContainer.length - 1]; // gets the last page
    let pageText: string = page.innerHTML; // gets the text from the last page
    let trimmedWord = word.replace(/((<br>)|(&emsp;))+$/g, ""); // rtrim the word
    page.innerHTML += trimmedWord + " "; // saves the text of the last page
    if (page.offsetHeight + Math.ceil(this.fontSize * .33) < page.scrollHeight) { // checks if the page overflows (more words than space)
      pageText = pageText.replace(/^((<br>)\s)+|((<br>)\s)+$/g, ""); // trim the pageText
      page.innerHTML = pageText; //resets the page-text
      return false; // returns false because page is full
    } else {
      page.innerHTML = pageText + word + " ";
      return true; // returns true because word was successfully filled in the page
    }
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
}
