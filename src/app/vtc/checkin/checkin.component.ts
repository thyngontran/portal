import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, UserParametersService, CognitoUtil, Callback} from "../../service/cognito.service";

import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../setting";


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})

export class CheckinComponent implements OnInit, OnDestroy, LoggedInCallback, Callback {

  //jwtokens
  accessToken: string;
  idToken: string;


  searchKeyword: string;
  players: Player[];

  //new player panel model
  newPlayerId: string;
  newPlayerName: string;
  newGroup: string;
  newCheckin: true;

  groups: string[];
  sites: string[];
  selectedSite: string;
  selectAllFlag: boolean;
  selectedPlayer: Player;

  constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService,private vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    this.userService.isAuthenticated(this);
    this.groups = setting.groups;
    this.sites = setting.sites;
    this.selectedSite = "2018Fall";
  }

  ngOnInit() {
    this.getPlayers();
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
      this.userParams.getParameters(this);//populate email; TODO-remove this field and rely on access token's attributes
    }
  }



  /*
  onSelect(player: Player): void {
    //this.selectedPlayer = player;
    this.newPlayerName = player.name;
    this.newGroup = player.group;
    //this.newCheckin = player.checkin;
    this.newPlayerId = player.playerId;
    //player.checkin = !player.checkin;
  }*/

  // populate - base on selected site
  onSelectSite(): void {
    console.log("TTTT selected site:"+ this.selectedSite);
    this.getPlayers();
  }


  checkInAll(): void {

    //toggle selectAllFlag
    this.selectAllFlag = !this.selectAllFlag;
    for (let player of this.players) {
      player.checkin = this.selectAllFlag;
    }

  }


  removePlayer(player: Player): void {
    this.players = this.players.filter(p => p !== player);
    //TODO delete from database
  }

  saveAllPlayers(): void {
    for (let player of this.players) {
      this.savePlayer(player);
    }
  }


  savePlayer(player: Player): void {
    console.log("TTTT Save"+ player);
    this.vtcService.write(player, this.accessToken)
    .subscribe (       
      success => console.log("Added Successful!"),
      error => {alert(JSON.stringify(error));}
    );

  }

  getPlayers(): void {

    this.vtcService.getAllPlayers(this.selectedSite,this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnPlayers = [];
      console.log("Inside checkin Component:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        let aPlayer = new Player(item.PlayerId,item.name, eval(item.checkin),item.groupName,
            item.createdBy, item.eventName
        );

        console.log("RestFul: Player" + JSON.stringify(aPlayer));
        returnPlayers.push(aPlayer);
      });

      returnPlayers.sort((p1,p2) => {
        return VtcService.naturalCompare(p1.name, p2.name);
      });

      this.players = returnPlayers;

    });

  }


  letsGo(): void {
    var statusText = "";
    statusText = this.vtcService.generate(this.players);
    this.saveAllPlayers();

    alert(statusText);

  }

  addPlayer(): void {

    //TODO get createdBy from username
    let newPlayer = new Player(""+new Date().getTime(),this.newPlayerName,this.newCheckin,this.newGroup,
    this.vtcService.createdBy,this.selectedSite);

    this.players.push(newPlayer);

    this.vtcService.write(newPlayer, this.accessToken)
    .subscribe (       
      success => console.log("Added Successful!"),
      error => {alert(JSON.stringify(error));}
    );
  }

  //implements Callback
  callback() {}

  callbackWithParam(result: any) {
      let name, value;
      for (let i = 0; i < result.length; i++) {
          name = result[i].getName();
          value = result[i].getValue();
          if (name == "username") {
            this.vtcService.createdBy = value;
            console.log("TTT found username from profile" + this.vtcService.createdBy);
          }
      }
  }
}

export class AccessTokenCallback implements Callback {
  constructor(public jwt: CheckinComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.accessToken = result;
  }
}

export class IdTokenCallback implements Callback {
  constructor(public jwt: CheckinComponent) {

  }

  callback() {

  }

  callbackWithParam(result) {
      this.jwt.idToken = result;
  }
}
