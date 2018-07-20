import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";
import { MomentModule } from "ngx-moment";

import { MyApp } from "./app.component";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { NovelsService } from "../providers/novels-service";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { LnChapterReaderModule } from "../components/ln-chapter-reader/ln-chapter-reader.module";
import { ReaderSettingsService } from "../providers/reader-settings-service";
import { ChaptersService } from "../providers/chapters-service";
import { FavoritesService } from '../providers/favorites-service';
import { LnLoadingController } from "../common/ln-loading-controller";
import { LnNovelListModule } from "../components/ln-novel-list/ln-novel-list.module";
import { NetworkServiceProvider } from '../providers/network-service';
import { SafeHttpProvider } from '../providers/safe-http';
import { Network } from "@ionic-native/network";
import { Diagnostic } from "@ionic-native/diagnostic";
import { NovelsLocalService } from "../providers/novels-local-service";
import { RecentNovelsService } from "../providers/recent-novels-service";
import { DownloadService } from "../providers/download-service";
import { Transfer } from "@ionic-native/transfer";
import { File } from "@ionic-native/file";
import { CodePush } from "@ionic-native/code-push";
import { AppVersion } from '@ionic-native/app-version';
import { Insomnia } from '@ionic-native/insomnia';
import { LastReadChapterService } from '../providers/last-read-chapter-service';
import { EpubService } from "../providers/epub-service";
import { SettingsService } from "../providers/settings-service";
import { AppUpdateService } from '../providers/app-update-service';
import { LocalNotifications } from "@ionic-native/local-notifications";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "bottom"
    }),
    IonicStorageModule.forRoot(),
    HttpModule,
    MomentModule,
    LnChapterReaderModule,
    LnNovelListModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    StatusBar,
    File,
    Transfer,
    CodePush,
    AppVersion,
    Insomnia,
    LocalNotifications,
    NovelsService,
    FavoritesService,
    ReaderSettingsService,
    ChaptersService,
    LnLoadingController,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Network,
    Diagnostic,
    NetworkServiceProvider,
    SafeHttpProvider,
    NovelsLocalService,
    RecentNovelsService,
    DownloadService,
    EpubService,
    LastReadChapterService,
    SettingsService,
    AppUpdateService
  ]
})
export class AppModule { }
