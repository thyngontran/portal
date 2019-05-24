import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, CognitoUtil, Callback} from "../service/cognito.service";
import {setting} from "../setting";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements LoggedInCallback {

  //jwtokens
  accessToken: string;
  idToken: string;

  public eventTypes;
  tournamentTypes: string[];

  constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil) {
    this.userService.isAuthenticated(this);
    this.eventTypes = setting.eventTypes;
    this.tournamentTypes = setting.tourneyTypes;
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
  constructor(public jwt: EventComponent) {

  }

  callback() {}

  callbackWithParam(result) {
      this.jwt.accessToken = result;
  }
}

export class IdTokenCallback implements Callback {
  constructor(public jwt: EventComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.idToken = result;
  }
}