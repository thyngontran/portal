import { Component} from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, CognitoUtil, Callback} from "../service/cognito.service";
import { VtcService } from '../service/vtc.service';
import {setting} from "../setting";
import { Player } from './vtcdomain';


@Component({
  selector: 'app-vtc',
  templateUrl: './vtc.component.html',
  styleUrls: ['./vtc.component.css']
})
export class VtcComponent implements LoggedInCallback {

  //jwtokens
  accessToken: string;
  idToken: string;

  allPlayers = [];

  public pools;
  sites: string[];

  constructor(public router: Router, public userService: UserLoginService, public vtcService: VtcService, public cognitoUtil: CognitoUtil, ) {
    this.userService.isAuthenticated(this);
    this.pools = setting.pools;
    this.sites = setting.sites;
    //this.selectedSite = "2018Fall";
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {

    if (!isLoggedIn) {
      this.router.navigate(['/home/login']);
    } else {
      this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
      this.cognitoUtil.getIdToken(new IdTokenCallback(this));
    }
  }

  get selectedSite():string { 
    return this.vtcService.selectedSite; 
  } 
  set selectedSite(value: string) { 
    this.vtcService.selectedSite = value; 
  } 

  saveAllPlayers(): void {
    for (let player of this.allPlayers) {
      this.savePlayer(player);
    }
  }

  savePlayer(player: Player): void {
    console.log("TTTT Save"+ player);
    this.vtcService.idToken = this.idToken;
    this.vtcService.write(player, this.accessToken)
    .subscribe (       
      () => console.log("Added Successful!"),
      error => {alert(JSON.stringify(error));}
    );
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