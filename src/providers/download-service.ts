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
import { DownloadItem, DownloadStatus, DownloadChapterItem } from "../common/models/download-item";

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
  }

  init() {
    this.fileTransfer = this.transfer.create();
    this.novelsDir = `${this.file.dataDirectory}${this.novelsDirName}/`;
  }

  // returns the list of all undowloaded chapters
  // call an api and match it with the downloaded files
  // remove the matched
  getUndownloadedChapters(novelId): Promise<any> {
    let onlineChapterList = this._getNovelChapterList(novelId).toPromise();
    let offlineChapterList = this.getNovelChapterList(novelId);

    return new Promise((resolve, reject) => {
      Promise.all([onlineChapterList, offlineChapterList])
        .catch(chapters => {
          let uniqueChapters = this._getUniqueChapterList(chapters);
          resolve(uniqueChapters);
        })
        .then(chapters => {
          let uniqueChapters = this._getUniqueChapterList(chapters);
          resolve(uniqueChapters);
        });
    });
  }

  private _getUniqueChapterList(chapters) {
    let onlineChapters = chapters[0];
    let offlineChapters = chapters[1];
    console.log("online chapters", onlineChapters);
    console.log("offline chapters", offlineChapters);
    return _.differenceBy(onlineChapters, offlineChapters, "id");
  }

  // duplicate function from novelsService (REFACTOR THIS!!)
  private _getNovelChapterList(id: string): Observable<Array<Chapter>> {
    console.log("DownloadService::_getNovelChapterList");
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
        return Observable.of([]);
      });
  }

  // add to queue
  addToQueue(novel, chapters) {

    let item = this.getItemFromQueue(novel);

    if (item) {
      item.chapters = item.chapters.concat(chapters);
    } else {
      // add to queue
      item = new DownloadItem({
        novel: novel,
        chapters: chapters
      });
      console.log("adding item", item);
      this.queue.push(item);
    }

    this.download(item);
  }

  // remove from queue
  removeFromQueue(item) {
    _.pull(this.queue, item);
  }

  // checker if novel in queue
  getItemFromQueue(novel) {
    return _.find(this.queue, item => item.novel.id === novel.id);
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
            // remove novel from queue
            this.removeFromQueue(downloadItem);
          });
      })
      .catch(err => {
        console.log("error creating root directory", err);
        // remove novel from queue
        this.removeFromQueue(downloadItem);
      });
  }

  private retrieveChapters(downloadItem, url, novelDir) {
    // iterate all and download
    _.each(downloadItem.chapters, chapter => {
      // check if status is not pending
      // meaning this chapter is already downloaded
      // from previous download attempts for this novel
      console.log("trying to download: ", chapter);
      if (chapter.status == DownloadStatus.Pending) {
        this.downloadChapter(chapter, url, novelDir)
      }
    });
  }

  private downloadChapter(chapter: DownloadChapterItem, url, novelDir) {
    // change chapter download status
    chapter.status = DownloadStatus.Ongoing;

    // download it
    this.fileTransfer
      .download(`${url}${chapter.number}`,
      `${novelDir}${chapter.number}.json`)
      .then(entry => {
        console.log("download complete: ", entry.toURL());

        // update progress
        chapter.status = DownloadStatus.Completed;
      })
      .catch(err => {
        console.log("error downloading, retrying...", err);

        // we retry
        this.downloadChapter(chapter, url, novelDir);
      });
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
            .catch(err => {
              reject(err);
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

  // retrieves the downloaded chapters
  getNovelChapterList(id: string): Promise<Array<Chapter>> {
    console.log("DownloadService::getNovelChapterList");

    return new Promise((resolve, reject) => {
      let chapters: Chapter[] = [];
      this.file
        .listDir(this.novelsDir, id.toString())
        .then(entries => {
          let chapterNumbers = _.map(entries, "name");
          let unreadableChapters = 0;

          // this means there are no downloaded chapters yet
          if (chapterNumbers.length == 0) {
            resolve([]);
          }

          _.each(chapterNumbers, chapterNumber => {
            this.readNovelChapter(id, chapterNumber)
              .then(chapter => {
                chapters.push(chapter);

                // if all chapters are read
                // resolve the chapters
                if (chapters.length >= chapterNumbers.length - unreadableChapters) {
                  resolve(chapters);
                }
              })
              .catch(err => {
                unreadableChapters += 1;
                console.log("error reading chapter", err);

                if (chapters.length >= chapterNumbers.length - unreadableChapters) {
                  resolve(chapters);
                }
              });
          });
        })
        .catch(err => {
          console.log("no downloaded chapters for this one yet", err);
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

  // get chapter list from queue
  getNovelChapterListFromQueue(id: string): Array<Chapter> {
    let item = _.find(this.queue, item => item.novel.id == id);
    return item.chapters;
  }
}
