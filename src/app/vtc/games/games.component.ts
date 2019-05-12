import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, UserParametersService, CognitoUtil, Callback} from "../../service/cognito.service";
import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../setting";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit, OnDestroy, LoggedInCallback{

  //jwtokens
  accessToken: string;
  idToken: string;

  generatedPool1 = [];
  generatedPool2 = [];
  generatedPool3 = [];
  allPlayers = [];
  pools = [];
  sites: string[];
  selectedSite: string;

  trackTeamWon;
  trackTeamLost;
  trackPointDif;

  constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService,private vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    this.userService.isAuthenticated(this);
    this.pools = setting.groups;
    this.sites = setting.sites;
    this.selectedSite = "2018Fall";
  }

  ngOnInit() {
    this.vtcService.getGamePlayers(this.selectedSite,"Gold",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside Games Component GOLD group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });


     this.allPlayers[0] = returnPlayers;
     this.generatedPool1 = returnPlayers;
    });


    this.vtcService.getGamePlayers(this.selectedSite,"Silver",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside game Component Silver group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });

     this.allPlayers[1] = returnPlayers;
     this.generatedPool2 = returnPlayers;
    });


    this.vtcService.getGamePlayers(this.selectedSite,"New",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside game Component New group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });

     this.allPlayers[2] = returnPlayers;
     this.generatedPool3 = returnPlayers;
    });

  }

    // populate - base on selected site
  onSelectSite(): void {
      console.log("TTTT selected site:"+ this.selectedSite);
      this.ngOnInit();
  }
  


  ngOnDestroy() {
    //console.log("TTTT onDestroy called... saveAllPlayers()");
    //this.saveAllPlayers();
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {

    if (!isLoggedIn) {
      this.router.navigate(['/home/login']);
    } else {
      this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
      this.cognitoUtil.getIdToken(new IdTokenCallback(this));
    }
  }




  trackScore():void {

    console.log ("TrackSCORE:" + this.allPlayers);

    for (let player of this.allPlayers) {

      //record all player on winner team
      if (player.checkin && player.team == this.trackTeamWon) {

        console.log ("Track gamewon:"+player.gameWon+"totalPoints"+player.totalPoints+"pointDif"+this.trackPointDif);

        player.gameWon++;
        player.totalPoints = Number(player.totalPoints) + Number(this.trackPointDif);
        //increase #gameplayed
        player.gamePlayed++;

        //write to database
        this.vtcService.write(player, this.accessToken); //TODO

      }

      //record all player on losing team
      if (player.checkin && player.team == this.trackTeamLost) {
        player.gameLost++;
        player.totalPoints = Number(player.totalPoints) - Number(this.trackPointDif);

        //increase #gameplayed
        player.gamePlayed++;

        //write to database
        this.vtcService.write(player, this.accessToken); //TODO

      }
    }

    alert("Save Score Succeffully...");

  }

}


export class AccessTokenCallback implements Callback {
  constructor(public jwt: GamesComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.accessToken = result;
  }
}

export class IdTokenCallback implements Callback {
  constructor(public jwt: GamesComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.idToken = result;
  }
}