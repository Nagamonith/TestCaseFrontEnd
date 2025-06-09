import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './components/shared/service/global.service';
import { ToastType } from 'devextreme/ui/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  defaultLanguage: string = '';
  isVisible = false;
  type: ToastType = 'success';
  message = 'Test Message';
  subscription: Subscription;

  constructor(
    private translate: TranslateService,
    public globalService: GlobalService
  ) {
    if(!localStorage.getItem('language')) {
      this.globalService.setStorageLanguage('language', 'English');
    }
    this.globalService.getStorageLanguage('language').subscribe(lang => {
      this.defaultLanguage = lang;
      this.translate.setDefaultLang(this.defaultLanguage);
    });
  }

  ngOnInit(): void {
    
    this.subscription = this.globalService.getBooleanObservable().subscribe(value => {
      if(value && this.globalService.isToastVisible) {
        this.message = this.globalService.toastMessage;
        this.isVisible = true;
        this.globalService.isToastVisible = false;
        this.globalService.booleanSubject.next(false);
      }
    });
  }
}
