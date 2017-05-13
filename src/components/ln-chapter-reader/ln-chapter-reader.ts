import { Component, OnInit, ViewChild, Input, OnChanges } from "@angular/core";
import { Chapter } from "../../common/models/chapter";

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
  fontSize: number;
  pageWidth: number;
  pageHeight: number;
  linePad: number; // extra vertical height around the fonts
  @ViewChild("slidesHolder") slidesHolder: any;
  @ViewChild("contentHolder") contentHolder: any;
  @Input("chapter") chapter: Chapter;

  constructor() {
  }

  ngOnInit() {
    // set the sizes
    this.fontSize = 18;
    this.linePad = this.fontSize + this.fontSize * .75; // extra vertical height around the fonts
    this.pageHeight = this.slidesHolder._elementRef.nativeElement.offsetHeight - this.linePad;
    this.pageWidth = this.slidesHolder._elementRef.nativeElement.offsetWidth;
    this.contentHolder.nativeElement.style.fontSize = this.fontSize + "px";
  }

  ngOnChanges() {
    if(!this.chapter) return;
    this.content = this.formatText(this.chapter.content);
    this.breakPages();
  }

  formatText(content: string) {
    // trim the content
    content = content.trim();
    // add an initial tab
    content = "&emsp;" + content;
    // replace the new lines with break plus tab
    content = content.replace(/\n/g, "<br>&emsp;");
    return content;
  }

  breakPages() {
    let text = this.content; // gets the text, which should be displayed later on
    let textArray = text.split(/\s/); // makes the text to an array of words
    this.createPage(); // creates the first page
    textArray.forEach(textValue => { // loops through all the words
      let success = this.appendToLastPage(textValue); // tries to fill the word in the last page
      if (!success) { // checks if word could not be filled in last page
        this.createPage(); // create new empty page
        textValue = textValue.replace(/^((<br>)|(&emsp;))+/g, "");// this will be the first word in the page, so ltrim it
        this.appendToLastPage(textValue); // fill the word in the new last element
      }
    });

    // get the values per page
    let pagesContainer = this.contentHolder.nativeElement.getElementsByClassName("page");
    let pagesValue = [];
    for (let i = 0; i < pagesContainer.length; i++) {
      pagesValue.push(pagesContainer[i].innerHTML);
    }
    this.contents = pagesValue;

    // remove the content holder
    this.contentHolder.nativeElement.remove();
  }

  createPage() {
    let page = document.createElement("div"); // creates new html element
    page.setAttribute("class", "page"); // appends the class "page" to the element
    page.style.width = this.pageWidth + "px"; // set the page width
    page.style.height = this.pageHeight + "px"; // set the page height
    this.contentHolder.nativeElement.appendChild(page); // appends the element to the container for all the pages
  }

  appendToLastPage(word) {
    let pagesContainer = this.contentHolder.nativeElement.getElementsByClassName("page");
    let page: any = pagesContainer[pagesContainer.length - 1]; // gets the last page
    let pageText: string = page.innerHTML; // gets the text from the last page
    let trimmedWord = word.replace(/((<br>)|(&emsp;))+$/g, ""); // rtrim the word
    page.innerHTML += trimmedWord + " "; // saves the text of the last page
    if (page.offsetHeight + Math.ceil(this.fontSize * .33) < page.scrollHeight) { // checks if the page overflows (more words than space)
      pageText = pageText.replace(/^[(<br>)\s]+|[(<br>)\s]+$/g, ""); // trim the pageText
      page.innerHTML = pageText; //resets the page-text
      return false; // returns false because page is full
    } else {
      page.innerHTML = pageText + word + " ";
      return true; // returns true because word was successfully filled in the page
    }
  }
}
