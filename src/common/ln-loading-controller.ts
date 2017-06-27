import { LoadingController, Loading } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class LnLoadingController extends LoadingController {
    loader: Loading;

    presentLoadingMessage(message = "Loading your stuff...") {
        this.loader = this.create({
            spinner: "hide",
            content: `<img src="assets/loading.gif" /><h3>${message}</h3>`
        });

        this.loader.present();
    }

    hideLoadingMessage(){
        this.loader.dismiss();
    }
}