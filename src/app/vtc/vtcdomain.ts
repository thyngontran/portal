
export class Player {
  playerId: string;
  name: string;
  checkin: boolean;
  group: string;
  createdBy: string;
  eventName: string;

  constructor(playerId: string,
              name: string,
              checkin: boolean,
              group: string,
              createdBy: string,
              eventName: string,
            ) {

    this.playerId = playerId;
    this.name = name;
    this.checkin = checkin;
    this.group = group;
    this.createdBy = createdBy;
    this.eventName = eventName;

  }

}

export const PLAYERS: Player[] = [
  {playerId:'1', createdBy:'thyngontran@gmail.com',eventName:'site1',name:'Harry Potter', checkin:true, group:"Gold"},
  {playerId:'2', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mary Lane', checkin:true, group:"Gold"},
  {playerId:'3', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mickie Orlando', checkin:true, group:"Gold"},
  {playerId:'4', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'John Doe', checkin:true, group:"Gold"},
  {playerId:'5', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Mary Walse', checkin:true, group:"Silver"},
  {playerId:'6', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Karika Kashe', checkin:true, group:"Silver"},
  {playerId:'7', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'Kari Cyburi', checkin:true, group:"Silver"},
  {playerId:'8', createdBy:'thyngontran@gmail.com',eventName:'site1', name:'LB Roy', checkin:true, group:"Silver"}
];
