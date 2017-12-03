import { LoadingController, Loading, Config, App } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class LnLoadingController extends LoadingController {
    loader: Loading;
    constructor(private app: App, config: Config) {
        super(app, config);
    }

    init() {
        // move the loading container to app-root
        let appRoot = document.querySelector("ng-component");
        let loadingContainer = document.querySelector(".loading-portal");
        appRoot.appendChild(loadingContainer);
    }

    presentLoadingMessage(message = "Loading your stuff...", isFull = false, isDark = false) {
        let cssClass = "loading-ion";
        if (isFull) {
            cssClass += " full";
        }

        if (isDark) {
            cssClass += " dark";
        }

        this.loader = this.create({
            spinner: "hide",
            content: `<img src="assets/loading.svg" />`,
            cssClass: cssClass,
            showBackdrop: false,
            dismissOnPageChange: true
        });

        return this.loader.present();
    }

    hideLoadingMessage() {
        let activePortal = this.app._appRoot._loadingPortal.getActive();
        if (activePortal) {
            this.loader.dismissAll();
            activePortal.dismiss();
        }
    }
}