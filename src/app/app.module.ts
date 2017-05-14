import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NovelsService } from '../providers/novels-service';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { LnLoadingModule } from "../components/ln-loading/ln-loading.module";
import { LnChapterReaderModule } from "../components/ln-chapter-reader/ln-chapter-reader.module";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom'
    }),
    HttpModule,
    LnLoadingModule,
    LnChapterReaderModule
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
    NovelsService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
