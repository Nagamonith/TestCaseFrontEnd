import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsComponent } from './components/layouts/layouts.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftnavbartreeComponent } from './components/leftnavbartree/leftnavbartree.component';
import { LeftnavigationbarComponent } from './components/leftnavbartree/leftnavigationbar/leftnavigationbar.component';

import { CoolSessionStorage } from '@angular-cool/storage';
import { CorelibModule } from 'corelib';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IgxSpreadsheetModule } from 'igniteui-angular-spreadsheet';
import { IgxExcelModule } from 'igniteui-angular-excel';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { DxToastModule } from 'devextreme-angular';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const dbConfig: DBConfig = {
  name: 'FmeaIndexDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'catalogueGridData',
      storeConfig: { keyPath: 'DocumentID', autoIncrement: false },
      storeSchema: [ { name: 'DocumentID', keypath: 'DocumentID', options: { unique: true } }],
    },
    {
      store: 'DocumentData',
      storeConfig: {keyPath: 'DocumentID', autoIncrement: false},
      storeSchema: [{ name: 'DocumentID', keypath: 'DocumentID', options: { unique: true } }],
    },
    {
      store: "NGlobals",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [  { name: 'id', keypath: 'id', options: { unique: true } }],
    },
    {
      store: "DocumentExcelData",
      storeConfig: {keyPath: 'DocumentID', autoIncrement: false},
      storeSchema: [{ name: 'DocumentID', keypath: 'DocumentID', options: { unique: true } }],
    },
  ],
};
@NgModule({
  declarations: [
    AppComponent,
    LayoutsComponent,
    HeaderComponent,
    LeftnavbartreeComponent,
    LeftnavigationbarComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CorelibModule.forRoot({}),
    NgbTooltipModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IgxExcelModule,
    IgxSpreadsheetModule,
    DxToastModule,   
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
