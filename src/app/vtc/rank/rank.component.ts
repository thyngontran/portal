import { Component, OnInit } from '@angular/core';
import { Player, PLAYERS } from '../vtcdomain';
import { VtcService } from '../../service/vtc.service';
import { Observable, of } from 'rxjs';
import {setting} from "../setting";

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {

  group1 =[];
  group2 =[];
  group3 =[];
  allPlayers = [];
  pools = [];

  constructor(private vtcService: VtcService) {
    this.pools = setting.groups;
  }

  ngOnInit() {
    this.allPlayers = this.vtcService.getRankPlayers("2018 Fall");
    this.group1 = this.allPlayers[0];
    this.group2 = this.allPlayers[1];
    this.group3 = this.allPlayers[2];
  }


}
