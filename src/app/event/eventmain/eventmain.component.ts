import { Component, OnInit } from '@angular/core';
import { EventComponent } from '../event.component';
import { Router } from '@angular/router';
import { UserLoginService, CognitoUtil } from '../../service/cognito.service';
import { VtcService } from '../../service/vtc.service';


@Component({
  selector: 'app-eventmain',
  templateUrl: './eventmain.component.html',
  styleUrls: ['./eventmain.component.css']
})
export class EventmainComponent extends EventComponent implements OnInit {

    //new event panel model
    newEventId: string;
    newEventName: string;
    newEventType: string;  //Bjerring Tournament, Team Tournament or League
    newEventTourneyType: string;  //Bjerring Tournament, Team Tournament or League
    newEventDuration: string;  //1day, 2days, 3days, or League (6 Saturdays, or Weds) 
    newEventInfo: string;
    newEventSignup: string;  //Team or Individual
    newEventEntryFee: string;
    newEventWaiverTemplate: string;
    newEventLocation: string;
    newIsPublic: true;

    events;  //main events list use as model in the UI page
    searchKeyword: string;


  constructor(public router: Router, public userService: UserLoginService, private vtcService: VtcService,public cognitoUtil: CognitoUtil) {
      super (router,userService,cognitoUtil);
  
  }
  
  ngOnInit() {
    this.getEvents();
  }

  checkInAll(): void {
  }

  addEvent(): void {
    var eventObj = {EventId: this.newEventId,
      EventName: this.newEventName,
      EventType: this.newEventType,
      EventTourneyType: this.newEventTourneyType,
      EventDuration: this.newEventDuration,
      EventInfo: this.newEventInfo,
      EventSignup: this.newEventSignup,
      EventEntryFee: this.newEventEntryFee,
      EventWaiverTemplate: this.newEventWaiverTemplate,
      EventLocation: this.newEventLocation,
      EventIsPublic: this.newIsPublic,
    }

    this.saveEvent(eventObj);

  }

  saveEvent(event: any): void {
    console.log("TTTT Save"+ event);
    this.vtcService.idToken = this.idToken;
    this.vtcService.writeEvent(event, this.accessToken)
    .subscribe (       
      () => console.log("Added Successful!"),
      error => {alert(JSON.stringify(error));}
    );
  }


  getEvents(): void {

    this.vtcService.idToken = this.idToken;
    this.vtcService.getAllEvents("thyngontran",this.accessToken)
    .subscribe(response => {
      var result = response["Items"];
      var returnEvents = [];
      console.log("Inside checkin Component:"+result);

      result.forEach(function(item) {
        console.log("RestFul: item" + JSON.stringify(item));
        returnEvents.push(item);
      });


      this.events = returnEvents;

    });

  }

}
