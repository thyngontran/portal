import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Router} from "@angular/router";

import {UserLoginService, UserParametersService, CognitoUtil} from "../../service/cognito.service";

import { Player } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';

import {VtcComponent} from "../vtc.component";


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})

export class CheckinComponent extends VtcComponent implements OnInit, OnDestroy, AfterViewInit {


  searchKeyword: string;

  //new player panel model
  newPlayerId: string;
  newPlayerName: string;
  newGroup: string;
  newCheckin: true;

  selectAllFlag: boolean;
  selectedPlayer: Player;

  constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService,public vtcService: VtcService,public cognitoUtil: CognitoUtil) {
    super (router,userService,vtcService,cognitoUtil);
  }

  ngOnInit() {
    //this.getPlayers();
  }

  ngAfterViewInit() {
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
    for (let player of this.allPlayers) {
      player.checkin = this.selectAllFlag;
    }

  }

  //TODO toggle Let's GO based on the state of checkin
  isCheckedIn():boolean {
    for (let player of this.allPlayers) {
      if (player.checkin == true) {
        return true;
      }
    }

    return false;
  }

  removePlayer(player: Player): void {
    this.allPlayers = this.allPlayers.filter(p => p !== player);
    //TODO delete from database

  }


  getPlayers(): void {

    this.vtcService.idToken = this.idToken;
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

      this.allPlayers = returnPlayers;

    });

  }


  letsGo(): void {
    var statusText = "";
    statusText = this.vtcService.generate(this.allPlayers);
    this.saveAllPlayers();
    this.router.navigate(['/vtc/games']);
    alert(statusText);

  }

  addPlayer(): void {

    //createdBy will be overwrite on server side by read from accessToken
    let newPlayer = new Player(""+new Date().getTime(),this.newPlayerName,this.newCheckin,this.newGroup,
    "thyngontran@gmail.com",this.selectedSite, new Date().toUTCString());

    //add to the table front-end
    this.allPlayers.push(newPlayer);

    //save player to backend
    this.savePlayer(newPlayer);
  }

}

