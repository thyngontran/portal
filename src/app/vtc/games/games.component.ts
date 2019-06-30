import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, UserParametersService, CognitoUtil, Callback} from "../../service/cognito.service";
import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../../setting";
import {VtcComponent} from "../vtc.component";


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent extends VtcComponent implements OnInit, OnDestroy, AfterViewInit{


  generatedPool1 = [];
  generatedPool2 = [];
  generatedPool3 = [];

  trackTeamWon;
  trackTeamLost;
  trackPointDif;

  constructor(public router: Router, public userService: UserLoginService, public vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    super (router,userService,vtcService,cognitoUtil);

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    /*this.vtcService.getGamePlayers(this.selectedSite,"Gold",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside Games Component GOLD group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        if (item.checkin) //only add checkin players
          returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });

     this.generatedPool1 = returnPlayers;
     this.allPlayers = this.generatedPool1;

    });
*/

    this.generatedPool1 = this.vtcService.generatedPool1;
    
    this.generatedPool1.sort((p1,p2) => {
     return p1.team - p2.team;
    });
    this.allPlayers = this.generatedPool1;

    
/*
    this.vtcService.getGamePlayers(this.selectedSite,"Silver",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside game Component Silver group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        if (item.checkin) //only add checkin players
          returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });

      this.generatedPool2 = returnPlayers;
      this.allPlayers = this.allPlayers.concat(this.generatedPool2);

    });
  */

 this.generatedPool2 = this.vtcService.generatedPool2;
 this.generatedPool2.sort((p1,p2) => {
  return p1.team - p2.team;
 });

 this.allPlayers = this.allPlayers.concat(this.generatedPool2);;


/*
    this.vtcService.getGamePlayers(this.selectedSite,"New",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside game Component New group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        if (item.checkin) //only add checkin players
          returnPlayers.push(item);
      });

      returnPlayers.sort((p1,p2) => {
        return p1.team - p2.team;
      });

      this.generatedPool3 = returnPlayers;
      this.allPlayers = this.allPlayers.concat(this.generatedPool3);
    });
*/

    this.generatedPool3 = this.vtcService.generatedPool3;
    this.allPlayers = this.allPlayers.concat(this.generatedPool3);;

  }

  // populate - base on selected site
  onSelectSite(): void {
      console.log("TTTT selected site:"+ this.selectedSite);
      this.ngAfterViewInit();
  }
  


  ngOnDestroy() {
    //console.log("TTTT onDestroy called... saveAllPlayers()");
    //this.saveAllPlayers();
  }

  letsGo(): void {

    var r = confirm("All current games will be reshuffle and will affect scores being recorded. Make sure to finish all ongoing games and record all scores before proceed.  Are you sure you want to continue? ");
    if (r == true) {
      //user chooses to continue 
      this.vtcService.generate(this.allPlayers);
      this.saveAllPlayers();

      this.generatedPool1.sort((p1,p2) => {
        return p1.team - p2.team;
      });
  
      this.generatedPool2.sort((p1,p2) => {
        return p1.team - p2.team;
      });
  
      this.generatedPool3.sort((p1,p2) => {
        return p1.team - p2.team;
      });
  
    } 

  }



  trackScore():void {
    console.log ("TrackSCORE:" + this.allPlayers);
    console.log ("TrackSCORE generatePool1:" + this.generatedPool1);

    for (let player of this.allPlayers) {
      console.log ("TrackSCORE:"+player.gameWon+"totalPoints"+player.totalPoints+"pointDif"+this.trackPointDif);

      player.gameWon = (player.gameWon==null)? 0 : player.gameWon;
      player.gameLost = (player.gameLost==null)? 0 : player.gameLost;
      player.totalPoints = (player.totalPoints==null)? 0 : player.totalPoints;
      player.gamePlayed = (player.gamePlayed==null)? 0 : player.gamePlayed;

      //record all player on winner team
      if (player.checkin && player.team == this.trackTeamWon) {

        console.log ("Track gamewon:"+player.gameWon+"totalPoints"+player.totalPoints+"pointDif"+this.trackPointDif);
        player.gameWon++;
        
        player.totalPoints = Number(player.totalPoints) + Number(this.trackPointDif);
        //increase #gameplayed
        player.gamePlayed++;

        //write to database
        this.vtcService.write(player, this.accessToken)    
        .subscribe (       
          success => console.log("Write score Successful!"),
          error => {alert(JSON.stringify(error));}
        );
      }

      //record all player on losing team
      if (player.checkin && player.team == this.trackTeamLost) {
        player.gameLost++;
        player.totalPoints = Number(player.totalPoints) - Number(this.trackPointDif);

        //increase #gameplayed
        player.gamePlayed++;

        //write to database
        this.vtcService.write(player, this.accessToken)        
        .subscribe (       
          success => console.log("Write score Successful!"),
          error => {alert(JSON.stringify(error));}
        );
      }
    }
    alert("Save Score Succeffully...");

  }

}

