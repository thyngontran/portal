import { Component, OnInit } from '@angular/core';
import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../setting";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  generatedPool1 = [];
  generatedPool2 = [];
  generatedPool3 = [];
  allPlayers = [];
  pools = [];

  trackTeamWon;
  trackTeamLost;
  trackPointDif;

  constructor(private vtcService: VtcService) {
    this.pools = setting.groups;
  }

  ngOnInit() {
    this.allPlayers = this.vtcService.getGamePlayers("2018 Fall");
    this.generatedPool1 = this.allPlayers[0];
    this.generatedPool2 = this.allPlayers[1];
    this.generatedPool3 = this.allPlayers[2];
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
        this.vtcService.write(player, "DUMMY_ACCESS_TOKEN"); //TODO

      }

      //record all player on losing team
      if (player.checkin && player.team == this.trackTeamLost) {
        player.gameLost++;
        player.totalPoints = Number(player.totalPoints) - Number(this.trackPointDif);

        //increase #gameplayed
        player.gamePlayed++;

        //write to database
        this.vtcService.write(player, "DUMMY_ACCESS_TOKEN"); //TODO

      }
    }

    alert("Save Score Succeffully...");

  }

}
