import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: '<span>onbroading process</span>',
})
export class AuthComponent {
  constructor(private router: Router, private activeroute: ActivatedRoute) {
    this.router.navigate(['/fmea/catalogue']);
  }
}
// import * as _ from 'lodash';
// import * as momentImported from 'moment';
// import { TranslateService } from '@ngx-translate/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { environment } from '../environments/environment';
// import { ServerService, LoaderService, Ssoauth, Alerts } from 'corelib';
// import { Component } from '@angular/core';
// const moment = momentImported;
// import * as TZ from 'moment-timezone';
// import { CoolSessionStorage } from '@angular-cool/storage';

// @Component({
//   selector: 'app-auth',
//   template: '<span></span>',
// })
// export class AuthComponent {
//   userDetails: any;
//   clientAppType: number = 2;
//   tokenExpiryPeriod: number = 10; //Token Expiry time in minutes
//   constructor(
//     private _sso: Ssoauth,
//     private router: Router,
//     private alert: Alerts,
//     private ldr: LoaderService,
//     private api: ServerService,
//     private tlz: TranslateService,
//     private ss: CoolSessionStorage,
//     private activeroute: ActivatedRoute
//   ) {
//     let token = this.activeroute.snapshot.paramMap.get('token') || '',
//       _type = '';
//     token = decodeURIComponent(token);
//     this.ldr.setLoader(true);
//     if (token == '') {
//       setTimeout(() => {
//         this.LoadConfig();
//         this.ldr.setLoader(false);
//       }, 2000);
//     } else {
//       _type = token.substring(token.length - 1, token.length);
//       token = token.substring(0, token.length - 1);
//       let _accesstoken = this.activeroute.snapshot.paramMap.get('accesstoken');
//       this._sso
//         .getUserInfo('user', {
//           username: '',
//           Appid: 4,
//           ExtendedFeatureID: 0,
//           ModuleID: 2,
//           AccessUserID: token,
//           type: _type,
//         })
//         .subscribe((ex) => {
//           let _exAccesstoken = ex.AccessToken.substring(
//             ex.AccessToken.length - 21,
//             ex.AccessToken.length - 1
//           );
//           if (_accesstoken != _exAccesstoken) {
//             this.api.logout();
//             return false;
//           }
//           this.LoadConfig(ex);

//           //Update ModuleId in DL_UserAuth for the User Session , this is needed while switching the Modules from HUB -> Sat and viceversa
//           this.api
//             .postMethodKey(
//               'login',
//               {
//                 userid: ex.users.userid,
//                 username: ex.users.username,
//                 Appid: 4,
//                 ExtendedFeatureID: 0,
//                 ModuleID: 2,
//                 ClientType: this.clientAppType,
//               },
//               'UpdateModuleIdForUserSession',
//               {}
//             )
//             .subscribe((re) => {});
//         });
//     }
//   }

//   languages: any = [];
//   LoadConfig(ex?: any) {
//     this.api
//       .getJsonMethod(
//         './assets/config/config.json?' + environment.releaseVersion
//       )
//       .subscribe((res) => {
//         this.languages = res.body.langs;
//         this.ss.setItem('modurl', JSON.stringify(res.body.modules));
//         this.ss.setItem('languages', JSON.stringify(res.body.langs));
//         this.LoadSettings(ex);
//       });
//   }

//   LoadSettings(ex?: any) {
//     //  try {
//     this.userDetails = this.api.userCache({});
//     console.log(this.userDetails);
//     if (this.userDetails) {
//       this.api
//         .postMethodKey('apiurl', {}, 'common/getSettings', {})
//         .subscribe((e) => {
//           this.ss.setItem('WebApiType', e.body.BrowserType || 'desktop');
//           if (
//             e.body.BrowserType &&
//             e.body.BrowserType.toLowerCase() == 'desktop'
//           ) {
//             this.clientAppType = 1;
//           } else {
//             this.clientAppType = 2;
//           }
//           this.ss.setItem('getSettings', JSON.stringify(e));
//           let _lan = 'en-US';
//           if (this.userDetails.users.userid == 0) {
//             this.ss.setItem('DecimalSymbol', e.body.DecimalSymbol || '.');
//             this.ss.setItem('UserDecimalSymbol', e.body.DecimalSymbol || '.');
//             _lan = e.body.Locale;
//             this.ss.setItem('DateFormat', e.body.DateFormat);
//             this.ss.setItem('TimeFormat', e.body.TimeFormat);
//             this.ss.setItem('TimeZone', e.body.TimeZone || '');
//           } else {
//             this.ss.setItem(
//               'DecimalSymbol',
//               this.userDetails.users.DecimalSymbol || '.'
//             );
//             this.ss.setItem(
//               'UserDecimalSymbol',
//               this.userDetails.users.DecimalSymbol || null
//             );
//             _lan = this.userDetails.users.Language || 'en-US';
//             if (
//               this.userDetails.users.TimeZone &&
//               this.userDetails.users.TimeZone != ''
//             )
//               this.ss.setItem('TimeZone', this.userDetails.users.TimeZone);
//             else {
//               this.ss.setItem('TimeZone', TZ.tz.guess());
//             }
//             if (
//               this.userDetails.users.DateTimeFormat &&
//               this.userDetails.users.DateTimeFormat != ''
//             ) {
//               var ind = this.userDetails.users.DateTimeFormat.indexOf('HH');
//               this.ss.setItem(
//                 'DateFormat',
//                 this.userDetails.users.DateTimeFormat.slice(0, ind)
//               );
//               this.ss.setItem(
//                 'TimeFormat',
//                 this.userDetails.users.DateTimeFormat.slice(ind)
//               );
//             } else {
//               this.ss.setItem('DateFormat', e.body.DateFormat);
//               this.ss.setItem('TimeFormat', e.body.TimeFormat);
//             }
//           }
//           let selectedLang = this.languages.filter((d) => d.code == _lan);
//           let _lanobj =
//             selectedLang.length > 0 ? selectedLang[0] : this.languages[0];
//           this.ss.setItem('selectlang', _lanobj.filepath);
//           // Converting to millseconds
//           this.tokenExpiryPeriod = (e.body.TokenExiryPeriod - 1) * 60000;
//           console.log(this.tokenExpiryPeriod);
//           if (ex) {
//             setTimeout(() => {
//               if (ex.users.AutoLogOff > 0) {
//                 let bufferTime = 300000,
//                   _sessionTimer = ex.users.AutoLogOff * 60000 - bufferTime;
//                 _sessionTimer = _sessionTimer < 1 ? 60000 : _sessionTimer;
//                 this.ss.setItem(
//                   'userSession',
//                   JSON.stringify({
//                     userIdle: true,
//                     sessionTimer: _sessionTimer,
//                     bufferTime: bufferTime,
//                     bcksessionTimer: this.tokenExpiryPeriod,
//                     AppID: 4,
//                     ExtendedFeatureID: 0,
//                     ModuleID: 2,
//                     url: 'RefreshClientHeartbeat',
//                   })
//                 );
//               } else {
//                 //30 mins 1800000
//                 this.ss.setItem(
//                   'userSession',
//                   JSON.stringify({
//                     userIdle: false,
//                     bcksessionTimer: this.tokenExpiryPeriod,
//                     bufferTime: 0,
//                     AppID: 4,
//                     ExtendedFeatureID: 0,
//                     ModuleID: 2,
//                     url: 'RefreshClientHeartbeat',
//                   })
//                 );
//               }
//               this.api.UserSessionchecker();
//               this.loadDefaultUrl();
//               this.ldr.setLoader(false);
//             }, 1000);
//           } else {
//             this.api.UserSessionchecker();
//           }
//         });
//     } else {
//       //TO CHECK
//       //this.loadDefaultUrl();
//       this.api.logout();
//     }
//     // } catch (ex) {
//     //     console.log("HeaderComponent:loadDashboard() " + ex);
//     // }
//   }

//   loadDefaultUrl() {
//     setTimeout(() => {
//       this.router.navigate(['/pages/catalogue']);
//     }, 500);
//   }
// }
