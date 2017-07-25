import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import 'rxjs/add/operator/map';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import _ from "lodash";

import { SafeHttpProvider } from "./safe-http";
import { NovelsLocalService } from "./novels-local-service";
import { EpubDownloadItem } from "../common/models/download-item";

@Injectable()
export class EpubService {

    fileTransfer: TransferObject;
    queue: EpubDownloadItem[] = [];
    epubsDir: string = "";
    epubsDirName: string = "epubs";

    constructor(private http: SafeHttpProvider,
        public file: File,
        private transfer: Transfer,
        private novelsLocalService: NovelsLocalService) {
        console.log('Hello Epubs Service');
    }

    init() {
        this.fileTransfer = this.transfer.create();
        this.epubsDir = `${this.file.externalRootDirectory}${this.epubsDirName}/`;
        this.createDir(this.epubsDirName, true);
    }

    // add to queue
    addToQueue(novel) {

        let item = this.getItemFromQueue(novel);

        if (!item) {
            // add to queue
            item = new EpubDownloadItem({
                novel: novel
            });
            console.log("adding item", item);
            this.queue.push(item);
            this.exportToEpub(item);
        }
    }

    // remove from queue
    removeFromQueue(item) {
        _.pull(this.queue, item);
    }

    // checker if novel in queue
    getItemFromQueue(novel) {
        return _.find(this.queue, item => item.novel.id === novel.id);
    }

    generateEpub(novelId) {
        console.log("EpubService::generateEpub");
        return this.http.get(`/api/epub/${novelId}/generate`)
            .map((response: Response) => {
                let data: any = response.json() || {};
                return data.percent;
            }).catch(error => {
                return Observable.throw(error);
            });
    }

    getGenerationProgress(novelId) {
        console.log("EpubService::getGenerationProgress");
        return this.http.get(`/api/epub/${novelId}/progress`)
            .map((response: Response) => {
                let data: any = response.json() || {};
                return data.percent;
            }).catch(error => {
                return Observable.throw(error);
            });
    }

    downloadEpub(downloadItem: EpubDownloadItem) {
        this.fileTransfer
            .download(`/api/epub/${downloadItem.novel.id}/download`,
            `${this.epubsDir}${downloadItem.novel.id}.epub`)
            .then(entry => {
                console.log("epub download complete: ", entry.toURL());
                downloadItem.progress = 100;
            })
            .catch(err => {
                console.log("error downloading epub", err);
            });
    }

    exportToEpub(downloadItem: EpubDownloadItem) {
        // first generate epub
        this.generateEpub(downloadItem.novel.id)
            .subscribe(() => {
                // poll until generation is finished
                this.epubGenerationProgress(downloadItem)
                    .then(() => {
                        console.log("trying to download epub");
                        // then download epub
                        this.downloadEpub(downloadItem);
                    });
            });
    }

    private epubGenerationProgress(downloadItem: EpubDownloadItem): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getGenerationProgress(downloadItem.novel.id)
                .subscribe(progress => {
                    // update progress
                    downloadItem.progress = Math.min(progress, 80);
                    // if not yet finished call this function again
                    // wait for 1 second
                    if (progress != 100) {
                        setTimeout(() => {
                            this.epubGenerationProgress(downloadItem);
                        }, 1000);
                    } else {
                        resolve();
                    }
                });
        });
    }

    private createDir(novelId, isRoot = false): Promise<any> {
        let rootDir = isRoot ? this.file.dataDirectory : this.epubsDir;
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
}
