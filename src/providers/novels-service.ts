import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import 'rxjs/add/operator/map';
import _ from "lodash";

import { Novel } from '../common/models/novel';
import { Chapter } from "../common/models/chapter";
import { Genre } from "../common/models/genre";
import { SafeHttpProvider } from "./safe-http";
import { DownloadService } from "./download-service";

@Injectable()
export class NovelsService {

  constructor(private http: SafeHttpProvider,
    private downloadService: DownloadService) {
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
      })
      .catch(error => {
        return Observable.throw(error);
      });
  }

  getNovel(id: string): Observable<Novel> {
    console.log("NovelsService::getNovel", id);
    return this.http.get(`/api/novels/${id}`)
      .map((response: Response) => {
        let data = <any>response.json() || {};
        return new Novel(data.id, data.title, data.cover, data.status, data.source, data.datePublished,
          data.lastUpdated, data.chaptersCount, data.synopsis, data.authors, data.genres);
      }).catch(error => {
        return Observable.throw(error);
      });
  }

  private getOnlineNovelChapterList(id: string): Observable<Array<Chapter>> {
    return this.http.get(`/api/novels/${id}/chapters`)
      .map((response: Response) => {
        let data: Array<object> = <any>response.json() || {};

        return data.map((c: Chapter): Chapter => new Chapter({
          id: c.id,
          number: c.number,
          title: c.title,
          content: ""
        })).sort((a, b) => b.number - a.number);
      }).catch(error => {
        return Observable.throw(error);
      });
  }

  getNovelChapterList(id: string): Promise<Array<Chapter>> {
    console.log("NovelsService::getNovelChapterList");

    return new Promise((resolve, reject) => {
      let chaptersRetrievalServices = [this.downloadService.getNovelChapterList(id), this.getOnlineNovelChapterList(id).toPromise()];

      Promise.all(chaptersRetrievalServices)
        .then(chapters => {
          let combinedChapters = [];
          let offlineChapters = chapters[0];
          let onlineChapters = chapters[1];

          // add all the offline chapters
          combinedChapters = combinedChapters.concat(offlineChapters);

          // add the online chapters that does not exist in offline chapters
          _.each(onlineChapters, chapter => {
            let foundChapter = _.find(offlineChapters, chap => chap.id === chapter.id);
            if (!foundChapter) {
              combinedChapters.push(chapter);
            }
          });

          // sort the chapters
          combinedChapters.sort((a, b) => b.number - a.number);
          resolve(combinedChapters);
        })
        .catch(() => {
          resolve([]);
        });
    });


  }

  getNovelChapter(novelId: string, chapterNumber: string): Promise<Chapter> {
    console.log("NovelsService::getNovelChapter");

    return new Promise((resolve, reject) => {
      // try getting locally first
      this.downloadService
        .readNovelChapter(novelId, chapterNumber + ".json")
        .then(chapter => {
          console.log("getting from offline");
          resolve(chapter);
        })
        .catch(error => {
          // get it online
          console.log("getting from online", error);
          this.http.get(`/api/novels/${novelId}/chapters/${chapterNumber}`)
            .map((response: Response) => {
              let data = response.json() || {};
              return new Chapter({
                id: data.id,
                number: data.number,
                title: data.title,
                content: data.content
              });
            })
            .subscribe(chapter => {
              resolve(chapter);
            });
        });
    });
  }

  getGenres() {
    console.log("NovelsService::getGenres");
    return this.http.get(`/api/genres`)
      .map((response: Response) => {
        let data: Array<Genre> = <any>response.json() || {};
        return data.sort((a, b) => a.name.localeCompare(b.name));
      }).catch(error => {
        return Observable.throw(error);
      });
  }
}
