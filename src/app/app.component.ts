import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ReaderSettingsService } from "../providers/reader-settings-service";

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
    private readerSettingsService: ReaderSettingsService) {
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
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn"t want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
