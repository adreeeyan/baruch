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
import { SettingsService } from "./settings-service";
import { Novel } from "../common/models/novel";

@Injectable()
export class EpubService {

    fileTransfer: TransferObject;
    queue: EpubDownloadItem[] = [];

    constructor(private http: SafeHttpProvider,
        public file: File,
        private transfer: Transfer,
        private novelsLocalService: NovelsLocalService,
        private settingsService: SettingsService) {
        console.log('Hello Epubs Service');
    }

    init() {
        this.fileTransfer = this.transfer.create();
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
        this.novelsLocalService.getNovel(downloadItem.novel.id.toString())
            .then((novel) => {
                this.fileTransfer
                    .download(`/api/epub/${downloadItem.novel.id}/download`,
                    `${this.settingsService.settings.epubLocation}${novel.title}.epub`)
                    .then(entry => {
                        console.log("epub download complete: ", entry.toURL());
                        downloadItem.progress = 100;
                    })
                    .catch(err => {
                        console.log("error downloading epub", err);
                    });
            });
    }

    exportToEpub(downloadItem: EpubDownloadItem) {
        // first generate epub
        this.generateEpub(downloadItem.novel.id)
            .subscribe(() => {
                // poll until generation is finished
                let poller = () => {
                    this.epubGenerationProgress(downloadItem)
                        .then(() => {
                            console.log("trying to download epub");
                            // then download epub
                            this.downloadEpub(downloadItem);
                        })
                        .catch(() => {
                            setTimeout(poller, 1000);
                        });
                };
                poller();
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
                        console.log("continue polling");
                        reject();
                    } else {
                        console.log("end polling");
                        resolve();
                    }
                });
        });
    }

    getDownloadedEpubs(): Promise<any> {
        return new Promise((resolve, reject) => {
            // get the holder directory
            let epubLocationDirHolder = this.settingsService.settings.epubLocation;
            epubLocationDirHolder = epubLocationDirHolder.substr(0, epubLocationDirHolder.length - 1);
            let tempDirSplit = epubLocationDirHolder.split("/");
            let dirName = tempDirSplit[tempDirSplit.length - 1];
            epubLocationDirHolder = epubLocationDirHolder.substr(0, epubLocationDirHolder.lastIndexOf("/") + 1);
            // list the directory
            this.file
                .listDir(epubLocationDirHolder, dirName)
                .then(entries => {
                    console.log("entries: ", entries);

                    // check if this is an epub
                    let probableFiles = _.filter(entries, entry => {
                        return entry.isFile && /\.epub$/.test(entry.name);
                    });
                    let titles = _.map(probableFiles, entry => entry.name.replace(/\.epub$/, ""));

                    // get the ids from the titles
                    this.novelsLocalService
                        .get()
                        .then(novels => {
                            // map novels
                            let filtered = _.filter(novels, (novel: Novel) => {
                                return _.includes(titles, novel.title);
                            });
                            filtered = _.filter(filtered, novel => !!novel);
                            let ids = _.map(filtered, "id");

                            // check if this epub is listed in the local service
                            // get local novels first
                            this.novelsLocalService
                                .getNovels(ids)
                                .then(novels => {
                                    resolve(novels);
                                });
                        });
                })
                .catch(() => {
                    resolve([]);
                });
        });
    }

    async deleteEpubs(epubs: Array<Novel>): Promise<any> {
        return new Promise((resolve, reject) => {
            let epubLocationDirHolder = this.settingsService.settings.epubLocation;
            epubLocationDirHolder = epubLocationDirHolder.substr(0, epubLocationDirHolder.length - 1);
            _.each(epubs, async epub => {
                await this.file.removeFile(epubLocationDirHolder, `${epub.title}.epub`);        
            });
            resolve();
        });
    }
}
