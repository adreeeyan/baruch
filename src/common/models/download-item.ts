import { Novel } from "./novel";
import { Chapter } from "./chapter";
import _ from "lodash";

export class DownloadItem {
  public novel: Novel;
  public chapters: DownloadChapterItem[];

  constructor(init?: Partial<DownloadItem>) {
    Object.assign(this, init);
  }

  get progress() {
    return Math.round(this.downloadedChapters.length / this.chapters.length * 100) || 0;
  }

  get status() {
    // check if all is there is still pending
    let isPending = _.every(this.chapters, chapter => chapter.status === DownloadStatus.Pending);
    if (isPending) {
      return DownloadStatus.Pending;
    }

    // check if there is an ongoing download
    let isOngoing = _.some(this.chapters, chapter => chapter.status === DownloadStatus.Ongoing);
    if (isOngoing) {
      return DownloadStatus.Ongoing;
    }

    // check if all is completed
    let isCompleted = _.every(this.chapters, chapter => chapter.status === DownloadStatus.Completed);
    if (isCompleted) {
      return DownloadStatus.Completed;
    }
  }

  get downloadedChapters() {
    return _.filter(this.chapters, chapter => chapter.status === DownloadStatus.Completed);
  }
}

export enum DownloadStatus {
  Pending,
  Ongoing,
  Completed,
  Error
}

export class DownloadChapterItem extends Chapter {
  public status: DownloadStatus = DownloadStatus.Pending;
  public checked: boolean = true;
}