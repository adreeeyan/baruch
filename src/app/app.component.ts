import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, ToastController, IonicApp, App, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { CodePush, SyncStatus } from "@ionic-native/code-push";
import { ReaderSettingsService } from "../providers/reader-settings-service";
import { LnLoadingController } from "../common/ln-loading-controller";
import { DownloadService } from "../providers/download-service";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LnList";

  overallPages: Array<any>;
  userPages: Array<any>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private ionicApp: IonicApp,
    private codePush: CodePush,
    private app: App,
    private readerSettingsService: ReaderSettingsService,
    private loadingController: LnLoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private downloadService: DownloadService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.overallPages = [
      { title: "All novels", icon: "home", component: "LnList" },
    ];

    this.userPages = [
      { title: "Favorites", icon: "heart", component: "LnFavorites" },
      { title: "Recently viewed", icon: "book", component: "LnRecentNovelsPage" },
      { title: "Downloaded", icon: "cloud-done", component: "LnDownloadsListPage" },
      { title: "Downloading queue", icon: "cloud-download", component: "LnDownloadsQueuePage" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      // Try to check if there are codepushes available
      this.checkForUpdate();

      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // initialize services here that needs to be initialized
      this.downloadService.init();
      this.readerSettingsService.init();
      this.loadingController.init();

      // Register back button
      this.registerBackButtonHandler();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn"t want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private checkForUpdate() {
    // note - mostly error & completed methods of observable will not fire
    // as syncStatus will contain the current state of the update
    this.codePush.sync()
      .catch((err) => {
        return [];
      })
      .subscribe((syncStatus) => {
        console.log("Syncing status: ", syncStatus);
        if (syncStatus == SyncStatus.UPDATE_INSTALLED) {
          let alert = this.alertCtrl.create({
            title: "Update installed",
            message: "Do you want me to restart the app in order for it to take effect?",
            buttons: [
              {
                text: "No",
                role: "cancel"
              },
              {
                text: "Yes",
                handler: () => {
                  this.codePush.restartApplication();
                }
              }
            ]
          });
          alert.present();
        }
      });
    const downloadProgress = (progress) => {
      console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
    }
    this.codePush.sync({}, downloadProgress)
      .catch((err) => {
        return [];
      })
      .subscribe((syncStatus) => {
        console.log("Syncing status other: ", syncStatus);
      });
  }

  private registerBackButtonHandler() {
    // Taken from https://stackoverflow.com/a/44365055 and https://github.com/ionic-team/ionic/issues/6982#issuecomment-295896544
    // Back button handle
    // Registration of push in Android and Windows Phone
    var lastTimeBackPress = 0;
    var timePeriodToExit = 2000;

    this.platform.registerBackButtonAction(() => {
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();

      //activePortal is the active overlay like a modal,toast,etc
      if (activePortal) {
        activePortal.dismiss();
        return
      }

      let view = this.nav.getActive(); // As none of the above have occurred, its either a page pushed from menu or tab

      if (this.nav.canGoBack() || view && view.isOverlay) {
        this.nav.pop(); //pop if page can go back or if its an overlay over a menu page
      }
      else {
        // Double check to exit app
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          this.platform.exitApp(); // Exit from app
        } else {
          let toast = this.toastCtrl.create({
            message: "Press back again to exit the application.",
            duration: timePeriodToExit,
            position: "bottom"
          });
          toast.present();
          lastTimeBackPress = new Date().getTime();
        }
      }
    }, 0);
  }
}
