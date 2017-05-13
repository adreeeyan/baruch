import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LnDetailsPage } from '../pages/ln-details-page/ln-details-page';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NovelsService } from '../providers/novels-service';
import { LnDetailsTabs } from '../pages/ln-details-tabs/ln-details-tabs';
import { LnList } from '../pages/ln-list/ln-list';
import { LnChapterReader } from "../components/ln-chapter-reader/ln-chapter-reader";
import { LnChapterPage } from "../pages/ln-chapter-page/ln-chapter-page";
import { LnChapterListPage } from "../pages/ln-chapter-list/ln-chapter-list";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

@NgModule({
  declarations: [
    MyApp,
    LnDetailsPage,
    LnDetailsTabs,
    LnList,
    LnChapterPage,
    LnChapterListPage,
    LnChapterReader
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom'
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LnDetailsPage,
    LnDetailsTabs,
    LnList,
    LnChapterPage,
    LnChapterListPage,
    LnChapterReader
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    StatusBar,
    NovelsService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
