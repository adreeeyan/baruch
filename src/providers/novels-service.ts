import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { Novel } from '../common/models/novel';
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

  getNovels() {

  }
  getNovel(id: string): Observable<Novel> {
    console.log("NovelsService::getNovel", id);
    return this.http.get(`http://kddppc369:5050/api/Novels/${id}`)
      .map((response: Response) => {
        let data = <any>response.json() || {};
        data.cover = "https://placehold.it/350x150" //temporary
        return new Novel(data.id, data.title, data.cover, data.status, data.source, data.datePublished, data.lastUpdated, data.chaptersCount, data.synopsis, data.authors);
      })
  }
}
