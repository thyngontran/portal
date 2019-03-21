import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {setting} from "../vtc/setting";

import { Observable, of } from 'rxjs';
import { Player} from '../vtc/vtcdomain';

declare var AWS: any;
declare var AWSCognito: any;


@Injectable({ providedIn: 'root' })
export class VtcService {

  createdBy = "guest@cyburi.com";
  locationId;

  generatedPool1;
  generatedPool2;
  generatedPool3;

  allPlayers;




  constructor(
    private http: HttpClient,public router: Router) { }

    getAWS() {
        return AWS;
    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        console.log ("ERROR occured in VTC Services.")
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

    // compare two strings
    public static naturalCompare(a, b) {
       var ax = [], bx = [];

       a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
       b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

       while (ax.length && bx.length) {
         var an = ax.shift();
         var bn = bx.shift();
         var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
         if (nn) return nn;
       }

       return ax.length - bx.length;
    }

    // compare two players; short by gamePlayed adn then gameWon, and then totalPoints
    public static rankCompare(a, b) {
        if (a.gamePlayed > b.gamePlayed) {
            return -11;
        } else if (a.gamePlayed == b.gamePlayed) {
          //check on gamewon
          if (a.gameWon > b.gameWon) {
             return -11;
          } else if (a.gameWon == b.gameWon) {
             // check on totalPoints
             if (a.totalPoints > b.totalPoints) {
               return -11;
             } else if (a.totalPoints == b.totalPoints) {
                // time
                return 0;
            }
          }
        }
        return 11;
    }


    getAllPlayers(locationId):Player[]{
        //need to handle credital that expired
        console.log("DynamoDBService: reading from DDB with creds - " + AWS.config.credentials);
        var params = {
            TableName: environment.vbcTableName,
            IndexName: "createdByIndex",
            KeyConditionExpression: "createdBy = :createdBy",
            FilterExpression: "locationId = :locationId",
            ExpressionAttributeValues: {
                ":createdBy": this.createdBy,
                ":locationId": locationId
            }
        };
        var result = [];
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) { //todo handle login expired

              console.error("DynamoDBService: Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
              //CredentialsError; 400
              if (err.statusCode == 400) {
                 //route to login
                 this.router.navigate(['/home/login']);
              }

            } else {
                // all the players
                console.log("DynamoDBService: Query succeeded.");


                data.Items.forEach(function(item) {

                  console.log("DynamoDBService: item" + JSON.stringify(item));
                  let aPlayer = new Player(item.PlayerId,item.name, eval(item.checkin),item.group,
                      item.team, item.net, item.gameWon,item.gameLost, item.gamePlayed,
                      item.totalPoints,item.createdBy, item.locationId
                    );

                  console.log("DynamoDBService: Player" + JSON.stringify(aPlayer));
                  result.push(aPlayer);

                  result.sort((p1,p2) => {
                      return VtcService.naturalCompare(p1.name, p2.name);
                  });

                });
            }
        }

        return result;
    }

    //Get Players that already checkin an by game.
    getGamePlayers(locationId):Player[]{
        //need to handle credital that expired
        console.log("DynamoDBService getRankPlayers(): reading from DDB with creds - " + AWS.config.credentials);
        var params = {
            TableName: environment.vbcTableName,
            IndexName: "createdByIndex",
            KeyConditionExpression: "createdBy = :createdBy",
            FilterExpression: "locationId = :locationId",
            ExpressionAttributeValues: {
                ":createdBy": this.createdBy,
                ":locationId": locationId  //TODO - add checkin filter
            }
        };
        var pool1 = [];
        var pool2 =[];
        var pool3 = [];
        var result = [];
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) { //todo handle login expired
                console.error("DynamoDBService: Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                // all the players
                console.log("DynamoDBService : Query succeeded.");

                data.Items.forEach(function(item) {

                  console.log("DynamoDBService: item" + JSON.stringify(item));
                  if (item.checkin == "true") {
                    let aPlayer = new Player(item.PlayerId,item.name, eval(item.checkin),item.group,
                        item.team, item.net, item.gameWon,item.gameLost, item.gamePlayed,
                        item.totalPoints,item.createdBy, item.locationId
                      );

                    console.log("DynamoDBService: add Player" + JSON.stringify(aPlayer));
                    if (aPlayer.group == "Gold")
                      pool1.push(aPlayer);
                    else if (aPlayer.group == "Silver")
                      pool2.push(aPlayer);
                    else
                      pool3.push(aPlayer);
                  } else {
                    console.log("DynamoDBService - Filter out player not checkin");
                  }
                });

                pool1.sort((p1,p2) => {
                  return p1.team - p2.team;
                });
                //need todo better same sort function
                pool2.sort((p1,p2) => {
                return p1.team - p2.team;
                });

                pool3.sort((p1,p2)=> {
                  return p1.team - p2.team;
                });
            }
        }

        result.push(pool1);
        result.push(pool2);
        result.push(pool3);
        return result;
    }


    getRankPlayers(locationId):Player[]{
        //need to handle credital that expired
        console.log("DynamoDBService getRankPlayers(): reading from DDB with creds - " + AWS.config.credentials);
        var params = {
            TableName: environment.vbcTableName,
            IndexName: "createdByIndex",
            KeyConditionExpression: "createdBy = :createdBy",
            FilterExpression: "locationId = :locationId",
            ExpressionAttributeValues: {
                ":createdBy": this.createdBy,
                ":locationId": locationId
            }
        };
        var pool1 = [];
        var pool2 =[];
        var pool3 = [];
        var result = [];
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) { //todo handle login expired
                console.error("DynamoDBService: Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                // all the players
                console.log("DynamoDBService : Query succeeded.");

                data.Items.forEach(function(item) {

                  console.log("DynamoDBService: item" + JSON.stringify(item));
                  let aPlayer = new Player(item.PlayerId,item.name, eval(item.checkin),item.group,
                      item.team, item.net, item.gameWon,item.gameLost, item.gamePlayed,
                      item.totalPoints,item.createdBy, item.locationId
                    );

                  console.log("DynamoDBService: Player" + JSON.stringify(aPlayer));
                  if (aPlayer.group == "Gold")
                    pool1.push(aPlayer);
                  else if (aPlayer.group == "Silver")
                    pool2.push(aPlayer);
                  else
                    pool3.push(aPlayer);

                });

                pool1.sort((p1,p2) => {
                  return VtcService.rankCompare(p1, p2);
                });
                //need todo better same sort function
                pool2.sort((p1,p2) => {
                  return VtcService.rankCompare(p1, p2);
                });

                pool3.sort((p1,p2)=> {
                  return VtcService.rankCompare(p1, p2);
                });
            }
        }

        result.push(pool1);
        result.push(pool2);
        result.push(pool3);
        return result;
    }


    writePlayer(player: Player) {
        try {
            let date = new Date().toString();
            console.log("DynamoDBService: Writing log entry. Type:" + player + " ID: " + AWS.config.credentials.params.IdentityId + " Date: " + date);
            this.write(player);
        } catch (exc) {
            console.log("DynamoDBService: Couldn't write to DDB");
        }

    }

    write(player: Player): void {
        console.log("DynamoDBService: writing " + player + " entry");
        var DDB = new AWS.DynamoDB({
            params: {TableName: environment.vbcTableName}
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    PlayerId: {S: player.playerId},
                    name: {S: player.name},
                    group: {S: player.group},
                    checkin: {S: player.checkin.toString()},
                    team: {S: player.team.toString()},
                    gamePlayed: {S: player.gamePlayed.toString()},
                    gameWon: {S: player.gameWon.toString()},
                    gameLost: {S: player.gameLost.toString()},
                    totalPoints: {S: player.totalPoints.toString()},
                    createdBy: {S: player.createdBy},
                    locationId: {S: player.locationId},
                    net: {S: player.net.toString()}
                }
            };

        console.log("DynamoDBService: before writting entry: " + JSON.stringify(itemParams));

        DDB.putItem(itemParams, function (result) {
          if (result != null)
            console.log("DynamoDBService ERROR: wrote entry: " + JSON.stringify(result));
        });
    }

    saveAndGenerate(players: Player[]): string {
        //TODO - save it to db
        return this.generate(players);
    }

    generate(players: Player[]): string {

      var generatedPool1 = [];
      var generatedPool2 = [];
      var generatedPool3 = [];
      var allTeamCount = 0;
      var totalNet = 1;
      var statusText = "";

      this.allPlayers = players;

      for (let player of players) {

          if (player.group =="Gold" && player.checkin){
              generatedPool1.push(player);
          } else if (player.group =="Silver" && player.checkin) {
              generatedPool2.push(player);
          } else { //unknown
              if(player.checkin){
                 generatedPool3.push(player);
              }
          }

        }

        //randomize pool1
        this.shuffleArray(generatedPool1);

        //assign team number
        var pool1TeamCount = 1;
        var pool1NumberTeam = Math.round(generatedPool1.length / setting.pool1TeamSize);
        for (let player of generatedPool1) {
            player.team = pool1TeamCount++;
            player.net = Math.round(player.team/2);
            if(pool1TeamCount > pool1NumberTeam){
                pool1TeamCount = 1
            }
            allTeamCount = (allTeamCount > pool1TeamCount)?allTeamCount:pool1TeamCount;

        }

        //randomize pool2
        this.shuffleArray(generatedPool2);

        //assign team number
        var pool2TeamCount = allTeamCount+1;
        var pool2TeamCountOrg = pool2TeamCount;
        var pool2NumberTeam = Math.round(generatedPool2.length / setting.pool2TeamSize);
        for (let player of generatedPool2) {
            player.team = pool2TeamCount++;
            player.net = Math.round(player.team/2);
            if((pool2TeamCount-pool2TeamCountOrg)+1 > pool2NumberTeam){
                pool2TeamCount = pool2TeamCountOrg;
            }
            allTeamCount = (allTeamCount > pool2TeamCount)? allTeamCount:pool2TeamCount;
        }

        //randomize pool3
        this.shuffleArray(generatedPool3);

        //assign team number
        var pool3TeamCount = allTeamCount+1;
        var pool3TeamCountOrg = pool3TeamCount;
        var pool3NumberTeam = Math.round(generatedPool3.length / setting.teamSize);
        for (let player of generatedPool3) {
            console.log("Allteamcount"+allTeamCount);
            console.log("pool3TeamCount before + 1 " + pool3TeamCount);

            player.team = pool3TeamCount++;
            player.net = Math.round(player.team/2);
            if((pool3TeamCount-pool3TeamCountOrg)+1 > pool3NumberTeam){
                pool3TeamCount = pool3TeamCountOrg
            }
            allTeamCount = (allTeamCount > pool3TeamCount)?allTeamCount:pool3TeamCount;

        }

        //this.saveAll(players);

        this.generatedPool1 = generatedPool1;
        this.generatedPool2 = generatedPool2;
        this.generatedPool3 = generatedPool3;

        statusText = "Need " + Math.round(allTeamCount/2) + " Nets Totals";
        return statusText;

    }

    // -> Fisher–Yates shuffle algorithm
    shuffleArray(players:Player[]) {
      var m = players.length, t, i;

      // While there remain elements to shuffle
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = players[m];
        players[m] = players[i];
        players[i] = t;
      }

    }


}