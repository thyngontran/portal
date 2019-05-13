import { last } from "@angular/router/src/utils/collection";

export class Player {
  PlayerId: string;
  name: string;
  checkin: boolean;
  groupName: string;
  createdBy: string;
  eventName: string;
  lastUpdated: string;

  constructor(playerId: string,
              name: string,
              checkin: boolean,
              groupName: string,
              createdBy: string,
              eventName: string,
              lastUpdated: string,
            ) {

    this.PlayerId = playerId;
    this.name = name;
    this.checkin = checkin;
    this.groupName = groupName;
    this.createdBy = createdBy;
    this.eventName = eventName;
    this.lastUpdated = lastUpdated;

  }

}

var utcDate1 = new Date();

export const PLAYERS: Player[] = [
  {PlayerId:'1', createdBy:'thyngontran@gmail.com',eventName:'site1',name:'Harry Potter', checkin:true, groupName:"Gold", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'2', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mary Lane', checkin:true, groupName:"Gold", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'3', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mickie Orlando', checkin:true, groupName:"Gold", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'4', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'John Doe', checkin:true, groupName:"Gold", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'5', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mary Walse', checkin:true, groupName:"Silver", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'6', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Karika Kashe', checkin:true, groupName:"Silver", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'7', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Kari Cyburi', checkin:true, groupName:"Silver", lastUpdated: utcDate1.toUTCString()},
  {PlayerId:'8', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'LB Roy', checkin:true, groupName:"Silver", lastUpdated: utcDate1.toUTCString()}
];
