import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import 'rxjs/add/operator/map';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import _ from "lodash";

import { SafeHttpProvider } from "./safe-http";
import { Chapter } from "../common/models/chapter";
import { Novel } from "../common/models/novel";
import { NovelsLocalService } from "./novels-local-service";

@Injectable()
export class DownloadService {

  fileTransfer: TransferObject;
  queue: DownloadItem[] = [];
  novelsDir: string = "";
  novelsDirName: string = "novels";

  constructor(private http: SafeHttpProvider,
    public file: File,
    private transfer: Transfer,
    private novelsLocalService: NovelsLocalService) {
    console.log('Hello Downloads Service');

    this.fileTransfer = this.transfer.create();
    this.novelsDir = `${this.file.dataDirectory}${this.novelsDirName}/`;
  }

  // returns the list of all undowloaded chapters
  // call an api and match it with the downloaded files
  // remove the matched
  getUndownloadedChapters(novelId): Promise<any> {
    return this._getNovelChapterList(novelId)
      .toPromise();
  }

  // duplicate function from novelsService (REFACTOR THIS!!)
  private _getNovelChapterList(id: string): Observable<Array<Chapter>> {
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
      }).catch(error => {
        return Observable.throw(error);
      });
  }

  // add to queue
  addToQueue(novel, chapters) {
    // add to queue
    let item = new DownloadItem({
      novel: novel,
      chapters: chapters
    });
    this.queue.push(item);

    this.download(item);
  }

  download(downloadItem: DownloadItem) {
    let url = `/api/Novels/${downloadItem.novel.id}/chapters/`;

    // create the root folder for novels first
    this.createDir(this.novelsDirName, true)
      .then(() => {
        // create a folder for the novel if it doesn't have
        let novelDir = this.novelsDir + downloadItem.novel.id + "/";
        this.createDir(downloadItem.novel.id)
          .then(entry => {
            this.retrieveChapters(downloadItem, url, novelDir);
          })
          .catch(err => {
            console.log("error creating directory", err);
          });
      })
      .catch(err => {
        console.log("error creating root directory", err);
      });
  }

  private retrieveChapters(downloadItem, url, novelDir) {
    // computation for progress
    let currentlyFinished = 0;

    // iterate all and download
    _.each(downloadItem.chapters, chapter => {
      this.fileTransfer
        .download(`${url}${chapter}`,
        `${novelDir}${chapter}.json`)
        .then(entry => {
          console.log("download complete: ", entry.toURL());

          // update progress
          currentlyFinished = this.updateProgress(downloadItem, currentlyFinished);
        })
        .catch(err => {
          console.log("error downloading", err);

          // still update progress
          currentlyFinished = this.updateProgress(downloadItem, currentlyFinished);
        });
    });
  }

  private updateProgress(downloadItem, currentlyFinished) {
    let total = downloadItem.chapters.length;
    currentlyFinished += 1;
    downloadItem.progress = currentlyFinished / total;

    // if all chapters is finished
    if (currentlyFinished === total) {
      downloadItem.isFinished = true;
    }

    return currentlyFinished;
  }

  private createDir(novelId, isRoot = false): Promise<any> {
    let rootDir = isRoot ? this.file.dataDirectory : this.novelsDir;
    return new Promise((resolve, reject) => {
      this.file
        .checkDir(rootDir, novelId.toString())
        .then(() => {
          // if directory exists, just do nothing
          resolve();
        })
        .catch(() => {
          // create the directory
          this.file
            .createDir(rootDir, novelId.toString(), false)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
    });
  }

  // retrieve the downloaded novels
  getNovels(): Promise<Array<Novel>> {
    console.log("DownloadService::getNovels");
    return new Promise((resolve) => {
      return this.getNovelIdsFromFolders()
        .then(ids => {
          this.novelsLocalService
            .getNovels(ids)
            .then(novels => {
              resolve(novels);
            });
        })
        .catch(() => {
          resolve([]);
        });
    });
  }

  private getNovelIdsFromFolders(): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      // list the directory
      this.file
        .listDir(this.file.dataDirectory, this.novelsDirName)
        .then(entries => {
          console.log("entries: ", entries);
          let ids = _.map(entries, "name");
          // convert ids to number
          ids = _.map(ids, id => parseInt(id));
          resolve(ids);
        })
        .catch(() => {
          resolve([]);
        });
    });
  }

  getNovelChapterList(id: string): Promise<Array<Chapter>> {
    console.log("NovelsLocalService::getNovelChapterList");

    return new Promise((resolve, reject) => {
      let chapters: Chapter[] = [];
      this.file
        .listDir(this.novelsDir, id.toString())
        .then(entries => {
          let chapterNumbers = _.map(entries, "name");
          _.each(chapterNumbers, chapterNumber => {
            this.readNovelChapter(id, chapterNumber)
              .then(chapter => {
                chapters.push(chapter);

                // if all chapters are read
                // resolve the chapters
                if (chapters.length == chapterNumbers.length) {
                  resolve(chapters);
                }
              })
              .catch(err => {
                console.log("error reading chapter", err);
              });
          });
        })
        .catch(() => {
          console.log("no downloaded chapters for this one yet");
          resolve([]);
        });
    });
  }

  readNovelChapter(novelId: string, chapterNumber: string): Promise<Chapter> {
    let novelDir = `${this.novelsDir}${novelId}/`;
    return new Promise((resolve, reject) => {
      this.file
        .readAsText(novelDir, chapterNumber.toString())
        .then(value => {
          resolve(JSON.parse(value));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export class DownloadItem {
  public novel: Novel;
  public chapters: Chapter[];
  public isFinished: boolean;
  private _progress: number;

  get progress() {
    return Math.round(this._progress * 100) || 0;
  }

  set progress(prog) {
    this._progress = prog;
  }

  constructor(init?: Partial<DownloadItem>) {
    Object.assign(this, init);
  }
}