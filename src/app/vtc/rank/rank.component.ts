import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, UserParametersService, CognitoUtil, Callback} from "../../service/cognito.service";

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../../setting";
import {VtcComponent} from "../vtc.component";

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent extends VtcComponent implements OnInit, OnDestroy{



  group1 =[];
  group2 =[];
  group3 =[];


  constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService,public vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    super (router,userService,vtcService,cognitoUtil);
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
        return VtcService.rankCompare(p1, p2);
      });

     this.group1 = returnPlayers;
     this.allPlayers = this.group1;

    });

    this.vtcService.getGamePlayers(this.selectedSite,"Silver",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside Games Component Silver group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnPlayers.push(item);
      });


      returnPlayers.sort((p1,p2) => {
        return VtcService.rankCompare(p1, p2);
      });

     this.group2 = returnPlayers;
     this.allPlayers = this.allPlayers.concat(this.group2);

    });

    this.vtcService.getGamePlayers(this.selectedSite,"New",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside Games Component New group:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnPlayers.push(item);
      });


      returnPlayers.sort((p1,p2) => {
        return VtcService.rankCompare(p1, p2);
      });

     this.group3 = returnPlayers;
     this.allPlayers = this.allPlayers.concat(this.group3);
    });  
  }

  ngOnDestroy() {
    //console.log("TTTT onDestroy called... saveAllPlayers()");
    //this.saveAllPlayers();
  }

  // populate - base on selected site
  onSelectSite(): void {
      console.log("TTTT selected site:"+ this.selectedSite);
      this.ngOnInit();
  }



  resetAllScores(): void {
    var r = confirm("Are you sure you want to reset all scores?");
    if (r == true) {
      for (let player of this.allPlayers) {
        //reset each player score
        player.gameWon = 0;
        player.gameLost = 0;
        player.totalPoints = 0;
        player.gamePlayed = 0;
        this.savePlayer(player);
      }
    }
  }

}
