import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {setting} from "../setting";

import { Observable, of } from 'rxjs';
import { Player} from '../vtc/vtcdomain';

declare var AWS: any;
declare var AWSCognito: any;


@Injectable({ providedIn: 'root' })
export class VtcService {


  locationId;
  idToken;
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

    // compare two players; sort by gamePlayed and then gameWon, and then totalPoints
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


    //eventId is used in the locationId
    getAllEvents(locationId,accessToken:string) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'eyJraWQiOiJkeUxZS3JRT2E2cVRBdUN1QnNZUzJYUXY1Y21peFN4NHNTb3JTTk1FMEJJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTc0MWQ4MC0zODM1LTRmZjAtYTdlYi1iYjgwNmY5NDVmNmEiLCJldmVudF9pZCI6ImYyNWI0NWVlLTY3NjAtMTFlOS1iMmIwLTJkNWZhNTQ0NzMzMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTYyMDAxNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0J5cmpOMlQwdCIsImV4cCI6MTU1NzM3NjkyNCwiaWF0IjoxNTU3MzczMzI0LCJqdGkiOiI4NjA5YzEyYS0zZmRlLTRjMjgtOGJiMC02ZmNlYjgzZmY4YjEiLCJjbGllbnRfaWQiOiI2czJ2a29kYjBoYWJhMzBoOHJza3BlNDQ1MiIsInVzZXJuYW1lIjoiMmU3NDFkODAtMzgzNS00ZmYwLWE3ZWItYmI4MDZmOTQ1ZjZhIn0.dVDlkBKAoz1hDF8sfFFTj66b3v-lTZOzwmNdrUZehiYs6-YxF6zGZQu5IpHwq6cmzY8dyhXckSQLJZjFBURluws93sXEe6I6irR2WqzM9KDCLBGGC97RgOuVvCjoKQ-1Xc9rnOYli9BmSfcIvW0Y81ho43GFIdkAlsEXlldI-8ppMX8f96-58r5NT447wrGrOap_Jula003S2mmrBNd1ucPFrdYswqczYQMXEefTTOGm7cySVSg1U8NrqHBZyvrFlgcZh987UuaFsd5FcofYr8mwR1k6OIvuLGOt_zTu29vT5vfVPLMc6ErnzFY9fsjNWdWWlNYjgmEbnOxNu2RsBg'
          'Authorization': this.idToken, 
          'type': 'TOKEN', 
          'authorizationToken': accessToken, 
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
        })
      };

      console.log("Event id:" + locationId);
      return this.http.get(environment.serverUrl+"/event/retrieveBy/"+locationId, httpOptions);

    }

    /** /
     *Use post to the CRUD event restful service
     */
    writeEvent(event: any, accessToken:string) {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'eyJraWQiOiJkeUxZS3JRT2E2cVRBdUN1QnNZUzJYUXY1Y21peFN4NHNTb3JTTk1FMEJJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTc0MWQ4MC0zODM1LTRmZjAtYTdlYi1iYjgwNmY5NDVmNmEiLCJldmVudF9pZCI6ImYyNWI0NWVlLTY3NjAtMTFlOS1iMmIwLTJkNWZhNTQ0NzMzMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTYyMDAxNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0J5cmpOMlQwdCIsImV4cCI6MTU1NzM3NjkyNCwiaWF0IjoxNTU3MzczMzI0LCJqdGkiOiI4NjA5YzEyYS0zZmRlLTRjMjgtOGJiMC02ZmNlYjgzZmY4YjEiLCJjbGllbnRfaWQiOiI2czJ2a29kYjBoYWJhMzBoOHJza3BlNDQ1MiIsInVzZXJuYW1lIjoiMmU3NDFkODAtMzgzNS00ZmYwLWE3ZWItYmI4MDZmOTQ1ZjZhIn0.dVDlkBKAoz1hDF8sfFFTj66b3v-lTZOzwmNdrUZehiYs6-YxF6zGZQu5IpHwq6cmzY8dyhXckSQLJZjFBURluws93sXEe6I6irR2WqzM9KDCLBGGC97RgOuVvCjoKQ-1Xc9rnOYli9BmSfcIvW0Y81ho43GFIdkAlsEXlldI-8ppMX8f96-58r5NT447wrGrOap_Jula003S2mmrBNd1ucPFrdYswqczYQMXEefTTOGm7cySVSg1U8NrqHBZyvrFlgcZh987UuaFsd5FcofYr8mwR1k6OIvuLGOt_zTu29vT5vfVPLMc6ErnzFY9fsjNWdWWlNYjgmEbnOxNu2RsBg'
          'Authorization': this.idToken,
          'type': 'TOKEN', 
          'authorizationToken': accessToken
        }),responseType: 'text' as 'json' 
      };
      console.log("Writing to restful server: event -" + JSON.stringify(event));
        
      return this.http.post(environment.serverUrl+"/event", event, httpOptions);
    }

    //eventId is used in the locationId
    getAllPlayers(locationId,accessToken:string) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'eyJraWQiOiJkeUxZS3JRT2E2cVRBdUN1QnNZUzJYUXY1Y21peFN4NHNTb3JTTk1FMEJJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTc0MWQ4MC0zODM1LTRmZjAtYTdlYi1iYjgwNmY5NDVmNmEiLCJldmVudF9pZCI6ImYyNWI0NWVlLTY3NjAtMTFlOS1iMmIwLTJkNWZhNTQ0NzMzMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTYyMDAxNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0J5cmpOMlQwdCIsImV4cCI6MTU1NzM3NjkyNCwiaWF0IjoxNTU3MzczMzI0LCJqdGkiOiI4NjA5YzEyYS0zZmRlLTRjMjgtOGJiMC02ZmNlYjgzZmY4YjEiLCJjbGllbnRfaWQiOiI2czJ2a29kYjBoYWJhMzBoOHJza3BlNDQ1MiIsInVzZXJuYW1lIjoiMmU3NDFkODAtMzgzNS00ZmYwLWE3ZWItYmI4MDZmOTQ1ZjZhIn0.dVDlkBKAoz1hDF8sfFFTj66b3v-lTZOzwmNdrUZehiYs6-YxF6zGZQu5IpHwq6cmzY8dyhXckSQLJZjFBURluws93sXEe6I6irR2WqzM9KDCLBGGC97RgOuVvCjoKQ-1Xc9rnOYli9BmSfcIvW0Y81ho43GFIdkAlsEXlldI-8ppMX8f96-58r5NT447wrGrOap_Jula003S2mmrBNd1ucPFrdYswqczYQMXEefTTOGm7cySVSg1U8NrqHBZyvrFlgcZh987UuaFsd5FcofYr8mwR1k6OIvuLGOt_zTu29vT5vfVPLMc6ErnzFY9fsjNWdWWlNYjgmEbnOxNu2RsBg'
          'Authorization': this.idToken, 
          'type': 'TOKEN', 
          'authorizationToken': accessToken, 
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
        })
      };

      console.log("Event id:" + locationId);
      return this.http.get(environment.serverUrl+"/player/allByEvent/"+locationId, httpOptions);

    }

    //Get Players that already checkin an by event and groupname.
    getGamePlayers(locationId, groupName, accessToken:string){

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'eyJraWQiOiJkeUxZS3JRT2E2cVRBdUN1QnNZUzJYUXY1Y21peFN4NHNTb3JTTk1FMEJJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTc0MWQ4MC0zODM1LTRmZjAtYTdlYi1iYjgwNmY5NDVmNmEiLCJldmVudF9pZCI6ImYyNWI0NWVlLTY3NjAtMTFlOS1iMmIwLTJkNWZhNTQ0NzMzMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTYyMDAxNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0J5cmpOMlQwdCIsImV4cCI6MTU1NzM3NjkyNCwiaWF0IjoxNTU3MzczMzI0LCJqdGkiOiI4NjA5YzEyYS0zZmRlLTRjMjgtOGJiMC02ZmNlYjgzZmY4YjEiLCJjbGllbnRfaWQiOiI2czJ2a29kYjBoYWJhMzBoOHJza3BlNDQ1MiIsInVzZXJuYW1lIjoiMmU3NDFkODAtMzgzNS00ZmYwLWE3ZWItYmI4MDZmOTQ1ZjZhIn0.dVDlkBKAoz1hDF8sfFFTj66b3v-lTZOzwmNdrUZehiYs6-YxF6zGZQu5IpHwq6cmzY8dyhXckSQLJZjFBURluws93sXEe6I6irR2WqzM9KDCLBGGC97RgOuVvCjoKQ-1Xc9rnOYli9BmSfcIvW0Y81ho43GFIdkAlsEXlldI-8ppMX8f96-58r5NT447wrGrOap_Jula003S2mmrBNd1ucPFrdYswqczYQMXEefTTOGm7cySVSg1U8NrqHBZyvrFlgcZh987UuaFsd5FcofYr8mwR1k6OIvuLGOt_zTu29vT5vfVPLMc6ErnzFY9fsjNWdWWlNYjgmEbnOxNu2RsBg'
          'Authorization': this.idToken,
          'type': 'TOKEN', 
          'authorizationToken': accessToken,
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
        })
      };

      console.log("Event id:" + locationId);
      return this.http.get(environment.serverUrl+"/player/getAssignedGamesByGroup/"+locationId
          +"?eventId="+locationId+"&group="+groupName, httpOptions);  
    }

    /** /
     *Use post to the CRUD player restful service
     */
    write(player: Player, accessToken:string) {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'eyJraWQiOiJkeUxZS3JRT2E2cVRBdUN1QnNZUzJYUXY1Y21peFN4NHNTb3JTTk1FMEJJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTc0MWQ4MC0zODM1LTRmZjAtYTdlYi1iYjgwNmY5NDVmNmEiLCJldmVudF9pZCI6ImYyNWI0NWVlLTY3NjAtMTFlOS1iMmIwLTJkNWZhNTQ0NzMzMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTYyMDAxNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0J5cmpOMlQwdCIsImV4cCI6MTU1NzM3NjkyNCwiaWF0IjoxNTU3MzczMzI0LCJqdGkiOiI4NjA5YzEyYS0zZmRlLTRjMjgtOGJiMC02ZmNlYjgzZmY4YjEiLCJjbGllbnRfaWQiOiI2czJ2a29kYjBoYWJhMzBoOHJza3BlNDQ1MiIsInVzZXJuYW1lIjoiMmU3NDFkODAtMzgzNS00ZmYwLWE3ZWItYmI4MDZmOTQ1ZjZhIn0.dVDlkBKAoz1hDF8sfFFTj66b3v-lTZOzwmNdrUZehiYs6-YxF6zGZQu5IpHwq6cmzY8dyhXckSQLJZjFBURluws93sXEe6I6irR2WqzM9KDCLBGGC97RgOuVvCjoKQ-1Xc9rnOYli9BmSfcIvW0Y81ho43GFIdkAlsEXlldI-8ppMX8f96-58r5NT447wrGrOap_Jula003S2mmrBNd1ucPFrdYswqczYQMXEefTTOGm7cySVSg1U8NrqHBZyvrFlgcZh987UuaFsd5FcofYr8mwR1k6OIvuLGOt_zTu29vT5vfVPLMc6ErnzFY9fsjNWdWWlNYjgmEbnOxNu2RsBg'
          'Authorization': this.idToken,
          'type': 'TOKEN', 
          'authorizationToken': accessToken
        }),responseType: 'text' as 'json' 
      };
      console.log("Writing to restful server: player -" + JSON.stringify(player));
        
      return this.http.post(environment.serverUrl+"/player", player, httpOptions);
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

          if (player.groupName =="Gold" && player.checkin){
              generatedPool1.push(player);
          } else if (player.groupName =="Silver" && player.checkin) {
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
