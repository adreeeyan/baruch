import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { NetworkServiceProvider } from "./network-service";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class SafeHttpProvider {

  constructor(private http: Http, private networkService: NetworkServiceProvider) {
    console.log('Hello SafeHttpProvider Provider');
  }

  get(url: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
      return Observable.throw("no internet");
    }
    else {
      return this.http.get(url, options);
    }
  }


  post(url: string, body: string, options?: RequestOptionsArgs) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
      return Observable.throw("no internet");
    }
    else {
      return this.http.post(url, body, options);
    }
  }

}
