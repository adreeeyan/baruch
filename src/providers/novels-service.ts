import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { Novel } from '../common/models/novel';
import { Chapter } from "../common/models/chapter";
/*
  Generated class for the Novels provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NovelsService {

  constructor(public http: Http) {
    console.log('Hello Novels Service');
  }

  getNovels(start: number, count: number): Observable<Array<Novel>> {
    console.log("NovelsService::getNovels");
    return this.http.get(`/api/novels?start=${start}&count=${count}`)
      .map((response: Response) => {
        let data: Array<object> = <any>response.json() || {};

        return data.map((d: Novel): Novel => {
          return new Novel(d.id, d.title, d.cover, d.status, d.source, d.datePublished, d.lastUpdated, d.chaptersCount, d.synopsis, d.authors)
        });
      });
  }

  getNovel(id: string): Observable<Novel> {
    console.log("NovelsService::getNovel", id);
    return this.http.get(`/api/novels/${id}`)
      .map((response: Response) => {
        let data = <any>response.json() || {};
        return new Novel(data.id, data.title, data.cover, data.status, data.source, data.datePublished, data.lastUpdated, data.chaptersCount, data.synopsis, data.authors);
      })
  }

  getNovelChapterList(id: string): Observable<Array<Chapter>> {
    console.log("NovelsService::getNovelChapterList");
    return this.http.get(`/api/novels/${id}/chapters`)
      .map((response: Response) => {
        let data: Array<object> = <any>response.json() || {};

        return data.map((c: Chapter): Chapter => new Chapter(c.id, c.number, c.title, ""))
                  .sort((a, b) => b.number - a.number);
      });
  }

  getNovelChapter(novelId: string, chapterNumber: string): Observable<Chapter> {
    console.log("NovelsService::getNovelChapter");
    return this.http.get(`/api/novels/${novelId}/chapters/${chapterNumber}`)
              .map((response: Response) => {
                let data = response.json() || {};
                return new Chapter(data.id, data.number, data.title, data.content);
              });
  }
}
