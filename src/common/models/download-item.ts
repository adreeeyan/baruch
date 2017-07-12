import { Novel } from "./novel";
import { Chapter } from "./chapter";

export class DownloadItem {
  public novel: Novel;
  public chapters: DownloadChapterItem[];
  public status: DownloadStatus = DownloadStatus.Pending;
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

export enum DownloadStatus {
    Pending,
    Ongoing,
    Completed,
    Error
}

export class DownloadChapterItem extends Chapter {
  public status: DownloadStatus;
}