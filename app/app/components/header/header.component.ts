import { Component, OnInit } from '@angular/core';
import { GlobalService, HeaderNav } from '../shared/service/global.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FMEA_Features } from '../../../../projects/catalogdoccomps/src/lib/models/fmeamodels';
import { TouchHistoryItem } from 'igniteui-angular-core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  dataSubscription: Subscription;
  headerNavList: HeaderNav[] = [];
  Preference:number;
  isDocument: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private dbService: NgxIndexedDBService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.globalService.getDataObservable().subscribe(data => {
      const localNavList = localStorage.getItem('headerNavList')
      this.headerNavList = JSON.parse(localNavList);
    });
  }

  // removeHeaderNav(nav: HeaderNav) {
  //   this.globalService.removeHeaderNavById(nav.id);
  //   this.dataSubscription = this.globalService.getDataObservable().subscribe(data => {
  //     this.headerNavList = data;
  //   });

  //  if(nav.pathId){
  //   this.globalService.getPreferencevalue().subscribe((res)=>{
  //     if(res){
  //       this.Preference=res.body;
  //       let isFlagbitSet = this.globalService.IsFlagBitSet(this.Preference,FMEA_Features.CHANGE_LOG);
  //       this.globalService.preferencesNbit = isFlagbitSet;
  //       this.globalService.booleanSubject.next(this.globalService.preferencesNbit);
  //     }
  //   });
  //  }
  //   this.router.navigate(['/fmea/catalogue']);
  // }

  async removeHeaderNav(nav: HeaderNav) {
    this.globalService.removeHeaderNavById(nav.id);
    const data = await firstValueFrom(this.globalService.getDataObservable());
    this.headerNavList = data;
    if (nav.pathId) {
      const res = await firstValueFrom(this.globalService.getPreferencevalue());
      if (res) {
        this.Preference = res.body;
        const isFlagbitSet = this.globalService.IsFlagBitSet(this.Preference, FMEA_Features.CHANGE_LOG);
        this.globalService.preferencesNbit = isFlagbitSet;
        this.globalService.Make1logMandatory = isFlagbitSet;
        this.globalService.booleanSubject.next(this.globalService.preferencesNbit);
      }
    }
   this.router.navigate(['/fmea/catalogue']);
  }
  
    

  gotoTargetPage(nav: HeaderNav) {
    // console.log(nav);
    if(nav.pathId || nav.pathId === 0) {
      this.router.navigate([
        nav.path,
        nav.pathId,
        nav.doctype
      ], {queryParams: {param: nav.param}});
    } else {
      this.router.navigate([
        nav.path
      ], {queryParams: {param: nav.param}});
    }
  }
}
