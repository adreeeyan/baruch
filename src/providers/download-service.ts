import { Injectable } from '@angular/core';

import { SafeHttpProvider } from "./safe-http";
import { NovelsService } from "./novels-service";

@Injectable()
export class DownloadService {

  constructor(private http: SafeHttpProvider,
    private novelsService: NovelsService) {
    console.log('Hello Downloads Service');
  }

  // returns the list of all undowloaded chapters
  // call an api and match it with the downloaded files
  // remove the matched
  getUndownloadedChapters(novelId): Promise<any> {
    return this.novelsService
      .getNovelChapterList(novelId)
      .toPromise();
  }
}
