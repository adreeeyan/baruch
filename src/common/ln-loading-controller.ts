import { LoadingController, Loading } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class LnLoadingController extends LoadingController {
    loader: Loading;

    init() {
        // move the loading container to app-root
        let appRoot = document.querySelector("ng-component");
        let loadingContainer = document.querySelector(".loading-portal");
        appRoot.appendChild(loadingContainer);
    }

    presentLoadingMessage(message = "Loading your stuff...") {
        this.loader = this.create({
            spinner: "hide",
            content: `<img src="assets/loading.svg" />`,
            cssClass: "loading-ion",
            showBackdrop: false,
            dismissOnPageChange: true
        });

        this.loader.present();
    }

    hideLoadingMessage() {
        this.loader.dismissAll();
    }
}