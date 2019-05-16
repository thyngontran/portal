import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";

import {LoggedInCallback, UserLoginService, UserParametersService, CognitoUtil, Callback} from "../../service/cognito.service";

import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../setting";

import {VtcComponent} from "../vtc.component";


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})

export class CheckinComponent extends VtcComponent implements OnInit, OnDestroy {


  searchKeyword: string;
  players: Player[];

  //new player panel model
  newPlayerId: string;
  newPlayerName: string;
  newGroup: string;
  newCheckin: true;

  selectAllFlag: boolean;
  selectedPlayer: Player;

  constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService,private vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    super (router,userService,cognitoUtil);
  }

  ngOnInit() {
    this.getPlayers();
  }

  ngOnDestroy() {
    //console.log("TTTT onDestroy called... saveAllPlayers()");
    //this.saveAllPlayers();
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
        returnPlayers.push(item);
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
    this.router.navigate(['/vtc/games']);
    alert(statusText);

  }

  addPlayer(): void {

    //createdBy will be overwrite on server side by read from accessToken
    let newPlayer = new Player(""+new Date().getTime(),this.newPlayerName,this.newCheckin,this.newGroup,
    "thyngontran@gmail.com",this.selectedSite, new Date().toUTCString());

    this.players.push(newPlayer);

    this.vtcService.write(newPlayer, this.accessToken)
    .subscribe (       
      success => console.log("Added Successful!"),
      error => {alert(JSON.stringify(error));}
    );
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
