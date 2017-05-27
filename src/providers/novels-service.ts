import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { Novel } from '../common/models/novel';
import { Chapter } from "../common/models/chapter";
import { ChaptersService } from "./chapters-service";
import { Genre } from "../common/models/genre";
/*
  Generated class for the Novels provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NovelsService {

  constructor(public http: Http, private chaptersService: ChaptersService) {
    console.log('Hello Novels Service');
  }
  encodeQueryData(data) {
    let ret = [];
    for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
  }
  getNovels(start: number, count: number, searchValue?: string, additionalParams?: object[]): Observable<Array<Novel>> {
    let data: any = {
      Start: start,
      Count: count
    }
    if (searchValue) {
      data.SearchKey = "Title";
      data.SearchValue = searchValue;
      data.IsFull = false;
    }

    let addedParams = "";
    if (additionalParams) {
      additionalParams.forEach(params => {
        addedParams += "&" + this.encodeQueryData(params);
      });
    }

    // set default sorting
    data.SortOrder = "Title";
    data.IsAsc = true;

    let params = this.encodeQueryData(data) + "&" + addedParams;
    let url = `/api/novels?${params}`;

    console.log("NovelsService::getNovels");
    return this.http.get(url)
      .map((response: Response) => {
        let data: Array<object> = <any>response.json() || {};

        return data.map((d: Novel): Novel => {
          return new Novel(d.id, d.title, d.cover, d.status, d.source, d.datePublished, d.lastUpdated, d.chaptersCount, d.synopsis, d.authors, d.genres)
        });
      });
  }

  getNovel(id: string): Observable<Novel> {
    console.log("NovelsService::getNovel", id);
    return this.http.get(`/api/novels/${id}`)
      .map((response: Response) => {
        let data = <any>response.json() || {};
        return new Novel(data.id, data.title, data.cover, data.status, data.source, data.datePublished,
          data.lastUpdated, data.chaptersCount, data.synopsis, data.authors, data.genres);
      })
  }

  getNovelChapterList(id: string): Observable<Array<Chapter>> {
    console.log("NovelsService::getNovelChapterList");
    return this.http.get(`/api/novels/${id}/chapters`)
      .map((response: Response) => {
        let data: Array<object> = <any>response.json() || {};

        return data.map((c: Chapter): Chapter => new Chapter({
          id: c.id,
          number: c.number,
          title: c.title,
          content: ""
        })).sort((a, b) => b.number - a.number);
      });
  }

  getNovelChapter(novelId: string, chapterNumber: string): Observable<Chapter> {
    console.log("NovelsService::getNovelChapter");
    return this.http.get(`/api/novels/${novelId}/chapters/${chapterNumber}`)
      .map((response: Response) => {
        let data = response.json() || {};
        return new Chapter({
          id: data.id,
          number: data.number,
          title: data.title,
          content: data.content
        });
      });
  }

  getGenres() {
    console.log("NovelsService::getGenres");
    return this.http.get(`/api/genres`)
      .map((response: Response) => {
        let data: Array<Genre> = <any>response.json() || {};
        return data.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
}
