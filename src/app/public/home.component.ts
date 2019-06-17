import {Component, OnInit} from "@angular/core";

declare let AWS: any;
declare let AWSCognito: any;

@Component({
    selector: 'VBCPortalAbout',
    template: '<p>Hello and welcome!"</p>'
})
export class AboutComponent {

}

@Component({
    selector: 'VBCPortalHomeLanding',
    templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
    constructor() {
        console.log("HomeLandingComponent constructor");
    }
}

@Component({
    selector: 'VBCPortalHome',
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {

    constructor() {
        console.log("HomeComponent constructor");
    }

    ngOnInit() {

    }

    onLoginClick(){
        const URL = "https://cyburiportal.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6s2vkodb0haba30h8rskpe4452&redirect_uri=http://localhost:4200";
        window.location.assign(URL);
    }
}
