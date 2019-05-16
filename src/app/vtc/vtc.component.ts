import { Component} from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, CognitoUtil, Callback} from "../service/cognito.service";
import {setting} from "./setting";


@Component({
  selector: 'app-vtc',
  templateUrl: './vtc.component.html',
  styleUrls: ['./vtc.component.css']
})
export class VtcComponent implements LoggedInCallback {


  //jwtokens
  accessToken: string;
  idToken: string;

  public pools;
  sites: string[];
  selectedSite: string;

  constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil) {
    this.userService.isAuthenticated(this);
    this.pools = setting.pools;
    this.sites = setting.sites;
    this.selectedSite = "2018Fall";
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {

    if (!isLoggedIn) {
      this.router.navigate(['/home/login']);
    } else {
      this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
      this.cognitoUtil.getIdToken(new IdTokenCallback(this));
    }
  }





}

export class AccessTokenCallback implements Callback {
  constructor(public jwt: VtcComponent) {

  }

  callback() {}

  callbackWithParam(result) {
      this.jwt.accessToken = result;
  }
}

export class IdTokenCallback implements Callback {
  constructor(public jwt: VtcComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.idToken = result;
  }
}