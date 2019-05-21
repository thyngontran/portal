import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {HomeLandingComponent, AboutComponent, HomeComponent} from "./public/home.component";
import {SecureHomeComponent} from "./secure/landing/securehome.component";
import {MyProfileComponent} from "./secure/profile/myprofile.component";
import {JwtComponent} from "./secure/jwttokens/jwt.component";
import {UseractivityComponent} from "./secure/useractivity/useractivity.component";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./public/auth/login/login.component";
import {RegisterComponent} from "./public/auth/register/registration.component";
import {ForgotPassword2Component, ForgotPasswordStep1Component} from "./public/auth/forgot/forgotPassword.component";
import {RegistrationConfirmationComponent, LogoutComponent} from "./public/auth/confirm/confirmRegistration.component";
import {ResendCodeComponent} from "./public/auth/resend/resendCode.component";

import {WelcomeComponent} from "./vtc/welcome/welcome.component";
import { CheckinComponent } from './vtc/checkin/checkin.component';
import { GamesComponent } from './vtc/games/games.component';
import { RankComponent } from './vtc/rank/rank.component';
import { VtcComponent } from './vtc/vtc.component';

import { EventCheckinComponent} from "./event/checkin/checkin.component";
import { EventComponent } from './event/event.component';
import { EventmainComponent } from './event/eventmain/eventmain.component';
import { BjerringComponent } from './event/bjerring/bjerring.component';
import { TeamComponent } from './event/team/team.component';
import { ScoreboardComponent } from '././event/scoreboard/scoreboard.component';


const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: 'about', component: AboutComponent},
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'confirmRegistration/:username', component: RegistrationConfirmationComponent},
            {path: 'resendCode', component: ResendCodeComponent},
            {path: 'forgotPassword/:email', component: ForgotPassword2Component},
            {path: 'forgotPassword', component: ForgotPasswordStep1Component},
            {path: '', component: HomeLandingComponent}
        ]
    },
];

const secureHomeRoutes: Routes = [
    {

        path: '',
        redirectTo: '/securehome',
        pathMatch: 'full'
    },
    {
        path: 'securehome', component: SecureHomeComponent, children: [
        {path: 'logout', component: LogoutComponent},
        {path: 'jwttokens', component: JwtComponent},
        {path: 'myprofile', component: MyProfileComponent},
        {path: 'useractivity', component: UseractivityComponent},
        {path: '', component: MyProfileComponent}]
    }
];

const vtcRoutes: Routes = [
  {
      path: '',
      redirectTo: '/vtc/welcome',
      pathMatch: 'full'
  },
  {
      path: 'vtc', component: VtcComponent, children: [
      {path: 'welcome', component: WelcomeComponent},
      {path: 'checkin', component: CheckinComponent},
      {path: 'games', component: GamesComponent},
      {path: 'rank', component: RankComponent},
    ]

  }
];

const eventRoutes: Routes = [
    {
        path: '',
        redirectTo: '/event/checkin',
        pathMatch: 'full'
    },
    {
        path: 'event', component: EventComponent, children: [
        {path: 'main', component: EventmainComponent},
        {path: 'checkin', component: EventCheckinComponent},
        {path: 'bjerring', component: BjerringComponent},
        {path: 'team', component: TeamComponent},
        {path: 'scoreboard', component: ScoreboardComponent},
      ]
  
    }
  ];
  

const routes: Routes = [
    {
        path: '',
        children: [
            ...homeRoutes,
            ...secureHomeRoutes,
            ...vtcRoutes,
            ...eventRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    }

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
