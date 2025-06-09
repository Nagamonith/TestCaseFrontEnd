import dom from 'jquery';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
// import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { LeftbarService } from '../leftbar.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { CoolSessionStorage } from '@angular-cool/storage';
// import { LoaderService, ServerService, Alerts, CorelibService } from "corelib";
import moment from 'moment';
// import * as momentImported from 'moment'; const moment = momentImported;
import * as TZ from 'moment-timezone';
import { LeftnavIcon } from './leftnavigationbar-icon.enum';
import { GlobalService } from '../../shared/service/global.service';

@Component({
  selector: 'app-leftnavigationbar',
  templateUrl: './leftnavigationbar.component.html',
  styleUrls: ['./leftnavigationbar.component.scss'],
})
export class LeftnavigationbarComponent implements OnInit {
  leftNavIcon = LeftnavIcon;
  defaultLanguage: string = '';
  
  @ViewChild('userNavLink') userNavLink: ElementRef;
  @ViewChild('userNavTemplate') userNavTemplate: ElementRef;

  constructor(
    public translate: TranslateService,
    //public ss: CoolSessionStorage,
    private route: Router,
    //private apicall: ServerService,
    //private log: NGXLogger,
    // private loader: LoaderService,
    //  private alert: Alerts,
    // private cls: CorelibService,
    private leftbar: LeftbarService,
    private globalService: GlobalService,
    private renderer: Renderer2
  ) {
    try {
      //this.relVern = 'cacheVerion=' + this.cls.getEnvironment().releaseVersion;
    } catch (ex) {
      // this.log.error('HeaderComponent:constructor() ' + ex);
    }

    this.globalService.getStorageLanguage('language').subscribe(lang => {
      this.defaultLanguage = lang;
      this.translate.setDefaultLang(this.defaultLanguage);
    });

    this.renderer.listen('window', 'click', (e:Event) => {
      if(this.showUserNav) {
        if(e.target != this.userNavLink.nativeElement && !this.userNavLink.nativeElement.contains(e.target) && !this.userNavTemplate.nativeElement.contains(e.target)) {
          this.showUserNav = false;
          this.showLanguageList = false;
        }
      }
    });

  }
  public statusmsg: any = { cls: 'alert-info', msg: '', display: false };
  errorMsg;
  settingsChanged = false;
  popup: boolean = false;
  specialfeaturetype: Number;
  specialfeature: boolean;
  id: any;
  languages: any = [];
  selectedLang: any = {};
  searchLangData: any = '';
  issettingenable: boolean = false;
  privilages: any = {};
  Headprivilage: any;
  userDetails: any;
  anonymous: any;
  showheader: boolean = true;
  show = false;
  showTimer: any;
  BrowserType: string;
  lookbackhour: Number;
  LicenseInvalid: boolean = false;
  relVern = 'cacheVerion=1';
  sh: any;
  isChecked: boolean = true;
  isdesktop: boolean = false;
  private modurl: any;
  licenceexpdays: any;
  aboutinfo: {};
  leftnavbardata: any = {};
  userinfo: any;
  activePage = 'home';
  showSwitchToHub = false;
  showWebLic = true;
  clientAppType: number = 2;

  showUserNav: boolean = false;
  showLanguageList: boolean = false;
  langIcon: any;
  langText: string;

  ngOnInit(): void {
    this.setlang();
    //  this.userinfo = JSON.parse(this.ss.getItem('user'));
    this.route.events.subscribe((val: any) => {
      if (val.url != undefined) {
        if (val.url.toUpperCase().indexOf('MAPPING') != -1)
          this.activePage = 'SatelliteMapping';
        else if (val.url.toUpperCase().indexOf('MANAGELAYOUT') != -1)
          this.activePage = 'ManageLayout';
        else if (
          val.url.toUpperCase().indexOf('DASHBOARD') != -1 &&
          val.url.toUpperCase().indexOf('/2/') != -1
        )
          this.activePage = 'dash';
        else if (
          val.url.toUpperCase().indexOf('DASHBOARD') != -1 &&
          val.url.toUpperCase().indexOf('/1/') != -1
        )
          this.activePage = 'admdash';
        // else if(val.url.toUpperCase().indexOf("REPORT")!=-1&&val.url.toUpperCase().indexOf("/1/")!=-1)
        //   this.activePage="repots";
        // else
        //  this.activePage="home";
        //console.log("activePage",val.url.toUpperCase().indexOf("REPORT"));
      }
    });

    if(localStorage.getItem('language')) {
      this.langText = localStorage.getItem('language');
      this.langIcon = this.leftNavIcon[localStorage.getItem('language')];
    } else {
      this.langText = 'English';
      this.langIcon = this.leftNavIcon.English;
    }
  }

  toggleUserNav() {
    this.showUserNav = !this.showUserNav;
  }

  toggleLanguageList() {
    this.showLanguageList = !this.showLanguageList;
  }

  switchLanguage(event: any) {
    const lang = event.srcElement.innerText;
    this.langIcon = this.leftNavIcon[lang];
    this.langText = lang;
    
    this.globalService.setStorageLanguage('language', lang);
    this.globalService.getStorageLanguage('language').subscribe(lang => {
      this.defaultLanguage = lang;
      this.translate.setDefaultLang(this.defaultLanguage);
    });
    this.showLanguageList = false;
  }

  setData(_data) {
    try {
      this.leftnavbardata = _data;
    } catch (ER) {}
  }

  lookbackvalidation(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  lookbackvalidationrefresh(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  LoadLogViewer() {
    // try {
    //   try {
    //     this.loader.setLoader(true);
    //     this.apicall
    //       .postMethodKey(
    //         'common',
    //         {
    //           options: 'add',
    //           data: [{ key: 'pages', values: 'logs' }],
    //         },
    //         'AddorDeleteComs',
    //         {}
    //       )
    //       .subscribe((res) => {
    //         if (res.body.code == 200) {
    //           setTimeout(() => {
    //             window.open(this.modurl['10'].navigateurl, '_blank');
    //             this.loader.setLoader(false);
    //           }, 3000);
    //         } else {
    //           this.loader.setLoader(false);
    //         }
    //       });
    //   } catch (Error) {
    //     this.loader.setLoader(false);
    //     this.log.error('LeftSide:constructor() ' + Error);
    //   }
    //   //     window.open(this.modurl["10"].navigateurl,"_blank");
    // } catch (ex) {
    //   this.log.error('LoadLogViewer:constructor() ' + ex);
    // }
  }

  searchLangFilter() {
    try {
      this.languages.map((d) => {
        d.hide = !d.name
          .toLowerCase()
          .includes(this.searchLangData.toLowerCase());
      });
    } catch (ex) {
      //  this.log.error('HeaderComponent1:changeLang() ' + ex);
    }
  }

  Loadaboutdata() {
    // try {
    //   console.log('browsertype', this.BrowserType);
    //   if (this.BrowserType != 'desktop') {
    //     this.apicall
    //       .serverMethod(
    //         'common',
    //         {
    //           appid: '1',
    //           moduleid: '2',
    //           extendedfeatureid: '0',
    //           ClientAppType: this.BrowserType,
    //         },
    //         'GetLicenseInfo',
    //         'post'
    //       )
    //       .subscribe((res) => {
    //         this.licenceexpdays = res;
    //         //  this.licenceExpiry();
    //       });
    //     this.apicall
    //       .serverMethod('common', {}, 'GetAboutAppinfo', 'post')
    //       .subscribe((res) => {
    //         this.aboutinfo = res;
    //       });
    //   }
    // } catch (Error) {
    //   this.log.error('HeaderComponent:Loadaboutdata() ' + Error);
    // }
  }

  onSearchChange(event) {
    this.settingsChanged = true;
    // this.specialfeaturetype=1;
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  LoadWindowsmenu(menu: any) {
    // try {
    //   if (menu.toLowerCase() == 'dashboard') {
    //     this.alert
    //       .actionAlter({
    //         close: false,
    //         action: [
    //           this.translate.instant('SAT_SEQ_LBL_YES'),
    //           this.translate.instant('SAT_SEQ_LBL_NO'),
    //         ],
    //         servity: 'info',
    //         msg: this.translate.instant('SAT_DASH_MSG_DOUWANTSATSATUS'),
    //       })
    //       .pipe(take(1))
    //       .subscribe((e) => {
    //         if (e && e.event == 0) {
    //           this.loader.setLoader(true);
    //           this.route.navigate(['/']);
    //         }
    //       });
    //   } else if (menu.toLowerCase() == 'license') {
    //     this.leftbar.setLeftNode(menu);
    //   } else {
    //     if (window['DLSatelliteContainer'] != undefined)
    //       window['DLSatelliteContainer'].registerSatelliteContainerEvent(
    //         menu,
    //         this.selectedLang.code
    //       );
    //   }
    // } catch (Error) {
    //   this.log.error('HeaderComponent:LoadWindowsmenu() ' + Error);
    // }
  }

  closemenu(flag) {
    try {
      if (this.showTimer) clearTimeout(this.showTimer);
      if (flag) {
        this.showTimer = setTimeout(() => {
          this.show = false;
        }, 4000);
      }
    } catch (ex) {
      //  this.log.error('HeaderComponent:closemenu() ' + ex);
    }
  }

  setlang() {
    try {
      //  let lang = this.ss.getItem('selectlang') || 'English';
      // this.modurl = JSON.parse(this.ss.getItem('modurl'));
      //  this.languages = JSON.parse(this.ss.getItem('languages'));
      // if (this.languages) {
      //   this.selectedLang = this.languages.filter((d) => d.filepath == lang);
      //   this.selectedLang = this.selectedLang[0] || this.languages[0];
      //   // this.changeLang(this.selectedLang);
      //   // this.setPrivileges();
      // }
    } catch (ex) {
      // this.log.error('setlang:constructor() ' + ex);
    }
  }

  changeLang(lang, select = false) {
    // try {
    //   this.selectedLang = lang;
    //   this.BrowserType = this.ss.getItem('WebApiType') || 'desktop';
    //   if (this.BrowserType.toUpperCase() == 'DESKTOP') {
    //     this.isdesktop = true;
    //     this.apicall
    //       .getMethod('common', {}, 'setLanguage/' + lang.filepath)
    //       .subscribe((e) => {});
    //   }
    //   this.translate.setDefaultLang(lang.filepath);
    //   this.ss.setItem('selectlang', lang.filepath);
    //   if (
    //     this.BrowserType.toUpperCase() == 'DESKTOP' &&
    //     window['DLSatelliteContainer'] != undefined
    //   ) {
    //     window['DLSatelliteContainer'].registerSatelliteContainerEvent(
    //       '',
    //       this.selectedLang.code
    //     );
    //   }
    //   if (select) {
    //     setTimeout(() => {
    //       location.reload();
    //     }, 1000);
    //   }
    // } catch (ex) {
    //   this.log.error('HeaderComponent:changeLang() ' + ex);
    // }
  }

  setPrivileges() {
    // try {
    //   this.apicall
    //     .getJsonMethod('./assets/privilages.json?' + this.relVern)
    //     .subscribe((res) => {
    //       if (res.body) {
    //         this.Headprivilage = res.body;
    //         this.userDetails = this.apicall.userCache({});
    //         let _priv = _.filter(
    //           this.userDetails.appPrivilegedetail.modulePrivilegedetail,
    //           (e) => {
    //             return e.ModuleID == 2;
    //           }
    //         );
    //         let _privil = _.reduce(
    //           _priv[0].Moduleprivileges,
    //           (o, k) => ((o[k] = true), o),
    //           {}
    //         );
    //         this.Headprivilage = { ...this.Headprivilage, ..._privil };
    //         this.checkHubLicense();
    //         this.ss.setItem('privilages', JSON.stringify(this.Headprivilage));
    //         this.resetPrivAllComps();
    //       }
    //       if (this.Headprivilage.ID_WIM_LIC_REG && !this.isdesktop) {
    //         this.showWebLic = true;
    //       } else if (this.isdesktop) {
    //         this.showWebLic = true;
    //       } else {
    //         this.showWebLic = false;
    //       }
    //     });
    // } catch (ex) {
    //   this.log.error('setPrivileges:setPrivileges() ' + ex);
    // }
  }

  Toggleheader(show: boolean) {
    try {
      this.showheader = show;
    } catch (ex) {
      // this.log.error('HeaderComponent:Toggleheader() ' + ex);
    }
  }

  specialfeatur() {
    console.log(this.specialfeature);
    if (this.specialfeature) {
      this.settingsChanged = true;
      this.specialfeaturetype = 1;
    } else {
      this.settingsChanged = true;
      this.specialfeaturetype = 0;
    }
  }

  resetPrivAllComps() {
    try {
      // dashboard.callBack.dashPriv = JSON.parse(
      //   this.ls.getItem("privilages")
      // );
      // this.userDetails = JSON.parse(this.ls.getItem("user"));
    } catch (ex) {
      //  this.log.error('HeaderComponent:resetPrivAllComps() ' + ex);
    }
  }

  navigate(opt) {
    try {
      switch (opt) {
        case 'hostselection':
          this.route.navigate(['/hostselection']);
          // this.is_interval_enable=false;
          break;
        case 'user':
          this.route.navigate(['/page/user/user']);
          // this.is_interval_enable=false;
          break;
        case 'role':
          this.route.navigate(['/page/user/role']);
          //this.is_interval_enable=false;
          break;
        case 'usergroup':
          this.route.navigate(['/page/user/usergroup']);
          // this.is_interval_enable=false;
          break;
        case 'login':
          this.route.navigate(['/login']);
          break;
        case 'pages':
          this.route.navigate(['/']);
          break;
        case 'layout':
          this.route.navigate(['/pages/managelayout']);
          // this.is_interval_enable=false;
          break;
        case 'mapping':
          this.route.navigate(['/pages/mapping']);
          // this.is_interval_enable=false;
          break;
        case 'oocnotification':
          // if(this.noOfNotification>0){
          //   this.route.navigate(["/pages/oocoosmanagement/1"]);
          //   //this.is_interval_enable=false;
          // }
          break;
      }
    } catch (ex) {
      //   this.log.error('HeaderComponent:navigate() ' + ex);
    }
  }

  public onclickactionitem(event, active?) {
    try {
      console.log('e34rssddfg56hhg', event, active);
      if (active) this.activePage = event;
      this.leftbar.setLeftNode(event);
    } catch (ER) {}
  }

  public logOut() {
    // this.apicall.logout();
  }

  checkHubLicense() {
    try {
      if (this.BrowserType.toUpperCase() == 'DESKTOP') {
        this.clientAppType = 1;
      } else {
        this.clientAppType = 2;
      }
      // this.apicall
      //   .serverMethod(
      //     'login',
      //     {
      //       userid: this.userinfo.users.userid,
      //       username: this.userinfo.users.username,
      //       Appid: 1,
      //       ModuleID: 1,
      //       ClientType: this.clientAppType,
      //     },
      //     'CheckLicenseSessionAvailability',
      //     'post'
      //   )
      //   .subscribe((res) => {
      //     if (res) {
      //       if (res.code == 200) {
      //         if (
      //           _.find(this.userinfo.appPrivilegedetail.modulePrivilegedetail, [
      //             'ModuleID',
      //             1,
      //           ]) != undefined
      //         ) {
      //           this.showSwitchToHub = true;
      //         } else this.showSwitchToHub = false;
      //       } else this.showSwitchToHub = false;
      //       //this.ss.setItem("privilages", JSON.stringify(this.Headprivilage));
      //       //this.resetPrivAllComps();
      //     }
      //   });
    } catch (Ex) {}
  }
  public switchApp(n) {
    try {
      // this.apicall
      //   .getJsonMethod('./assets/config/config.json?')
      //   .subscribe((res) => {
      //     let _urls = res.body.modules;
      //     let _accesstoken = this.userinfo.AccessToken.substring(
      //       this.userinfo.AccessToken.length - 21,
      //       this.userinfo.AccessToken.length - 1
      //     );
      //     window.location.href =
      //       _urls[11].navigateurl +
      //       encodeURIComponent(this.userinfo.AccessUserID) +
      //       this.userinfo.type +
      //       '/' +
      //       _accesstoken;
      //   });
    } catch (error) {
      console.log('switchApp', error);
    }
  }
  //Fmea code need to add here
}
