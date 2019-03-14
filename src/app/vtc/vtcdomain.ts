
export class Player {
  playerId: string;
  name: string;
  checkin: boolean;
  group: string;
  team: number;
  net: number;
  gameWon: number;
  gameLost: number;
  gamePlayed: number;
  totalPoints: number;
  createdBy: string;
  locationId: string;

  constructor(playerId: string,
              name: string,
              checkin: boolean,
              group: string,
              team: number,
              net: number,
              gameWon: number,
              gameLost: number,
              gamePlayed: number,
              totalPoints: number,
              createdBy: string,
              locationId: string,
            ) {

    this.playerId = playerId;
    this.name = name;
    this.checkin = checkin;
    this.group = group;
    this.team = team;
    this.net = net;
    this.gameWon = gameWon;
    this.gameLost = gameLost;
    this.gamePlayed = gamePlayed;
    this.totalPoints = totalPoints;
    this.createdBy = createdBy;
    this.locationId = locationId;

  }

}

export const PLAYERS: Player[] = [
  {playerId:'1', createdBy:'thyngontran@gmail.com',locationId:'site1',name:'Harry Potter', checkin:true, group:"Gold", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'2', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'Mary Lane', checkin:true, group:"Gold", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'3', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'Mickie Orlando', checkin:true, group:"Gold", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'4', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'John Doe', checkin:true, group:"Gold", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'5', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'Mary Walse', checkin:true, group:"Silver", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'6', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'Karika Kashe', checkin:true, group:"Silver", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'7', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'Kari Cyburi', checkin:true, group:"Silver", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0},
  {playerId:'8', createdBy:'thyngontran@gmail.com',locationId:'site1', name:'LB Roy', checkin:true, group:"Silver", team:0, net:0, gameWon:0, gameLost:0, gamePlayed:0, totalPoints:0}
];
