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

@NgModule({
  declarations: [
    MyApp,
    LnDetailsPage,
    LnDetailsTabs,
    LnList
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LnDetailsPage,
    LnDetailsTabs,
    LnList
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NovelsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
