import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ReaderSettingsService } from "../providers/reader-settings-service";
import { LnLoadingController } from "../common/ln-loading-controller";

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
    private readerSettingsService: ReaderSettingsService,
    private loadingController: LnLoadingController,
    private toastCtrl: ToastController) {
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
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // initialize services here that needs to be initialized
      this.readerSettingsService.init();
      this.loadingController.init();

      // Taken from https://stackoverflow.com/a/44365055
      // Back button handle
      // Registration of push in Android and Windows Phone
      var lastTimeBackPress = 0;
      var timePeriodToExit = 2000;

      this.platform.registerBackButtonAction(() => {
        // Check if view is currently root
        if (!this.nav.canGoBack()) {
          // Double check to exit app
          if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
            this.platform.exitApp(); // Exit from app
          } else {
            let toast = this.toastCtrl.create({
              message: "Press back again to exit application.",
              duration: 3000,
              position: "bottom"
            });
            toast.present();
            lastTimeBackPress = new Date().getTime();
          }
        } else {
          // go to previous page
          this.nav.pop({});
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn"t want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
