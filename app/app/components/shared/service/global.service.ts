import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject,firstValueFrom } from 'rxjs';
import { Fmeadocument, ImportExcelSettingForCP, ImportExcelSettingForDFMEAVDA, ImportExcelSettingForFormC, ImportExcelSettingForMedical, ImportExcelSettingForPfmea, PreferencesSubMenus } from '../../../../../projects/catalogdoccomps/src/lib/models/fmeamodels';
import { forEach } from 'lodash';
import { custom } from 'devextreme/ui/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FastReflectionHelper } from 'igniteui-angular-core';
import { FMEA_Features } from '../../../../../projects/catalogdoccomps/src/lib/models/fmeamodels';
import { ServerService } from 'corelib';

export class HeaderNav {
  id: number;
  name: string
  path: string;
  pathId?: number;
  doctype?:number;
  param?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  commonProgressBarDialog: any;
  private dataObservable: Observable<HeaderNav[]>;
  private dataObserver: Observer<HeaderNav[]>;

  public closeSubject: Subject<boolean> = new Subject<boolean>();
  closeMessage$ = this.closeSubject.asObservable();
  
  private changeLogRefreshSource = new BehaviorSubject<boolean>(false);
  changeLogRefresh$ = this.changeLogRefreshSource.asObservable();
  public Make1logMandatory : boolean=false;

  emitChangeLogRefreshSignal(refresh: boolean) {
    this.changeLogRefreshSource.next(refresh);
  }

  preferencesNbit: boolean = false;
  
  private columnInfoObservable: Observable<any>;
  private triggerCellChangeSubject = new Subject<void>();
  ifCellChangeTrigger = this.triggerCellChangeSubject.asObservable();
  public columnInfo: any;

  private documentObservable: Observable<Fmeadocument[]>;
  private documentObserver: Observer<Fmeadocument[]>;

  public importFromExcelDocInfo:Fmeadocument;
  public importPfmeaExcelSettings:ImportExcelSettingForPfmea= new ImportExcelSettingForPfmea();
  public importFormCExcelSettings:ImportExcelSettingForFormC = new ImportExcelSettingForFormC();
  public importDfmeavdaExcelSettings:ImportExcelSettingForDFMEAVDA = new ImportExcelSettingForDFMEAVDA();
  public importCPExcelSettings:ImportExcelSettingForCP = new ImportExcelSettingForCP();
  public importMedicalExcelSettings:ImportExcelSettingForMedical = new ImportExcelSettingForMedical();

  documentList: Fmeadocument[] = [];
  headerNavList: HeaderNav[] = [
    {
      id: Math.floor(Math.random() * 100),
      name: 'Catalogue',
      path: '/fmea/catalogue'
    },
  ];

  selectedDocumentInfo: Fmeadocument;

  showClassificationSet: boolean;
  public booleanSubject: Subject<boolean> = new Subject<boolean>();

  private localStorageLanguage = new BehaviorSubject<string | null>(null);

  selectedDoctypeMinor: number = 0;
  
  DocTabIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedDocTabIndex: Observable<number> = this.DocTabIndexSubject.asObservable();

  isToastVisible: boolean = false;
  toastMessage: string = '';
  showWhys: boolean = false;
  showHeaders: boolean = false;
  showAttachDocument: boolean = false;
  showAdoptions: boolean = false;
  expandAllAdoptionGridRow: boolean = false;
  moveUpSelectedRowActivated: boolean = false;
  moveDownSelectedRowActivated: boolean = false;

  commonAlertBoxDialog: any;

  private renderer: Renderer2;
  showChangeLog: boolean = false;

  activePreferencesTab = PreferencesSubMenus.General;

  showImportExcel: boolean = false;

  featureName: string;
  showFeatureAlert: boolean;

  refresh:boolean=false;
  AdoptedDocList:any[];

  viewFilterActive: boolean = false;
  viewPreferencesActive: boolean = false;

  constructor(private rendererFactory: RendererFactory2,
    private apiCall: ServerService
  ) {
    // Create an instance of Renderer2 using RendererFactory2
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.dataObservable = new Observable((observer: Observer<HeaderNav[]>) => {
      this.dataObserver = observer;
      // Emit initial data
      observer.next(this.headerNavList);
    });

    this.columnInfoObservable = new Observable((observer: Observer<any>) => {
      observer.next(this.columnInfo);
    });

    this.documentObservable = new Observable((observer: Observer<Fmeadocument[]>) => {
      this.documentObserver = observer;
      observer.next(this.documentList);
    });



    // language
    const initialLanguage = localStorage.getItem('language');
    this.localStorageLanguage.next(initialLanguage);
  }

  public getBooleanObservable(): Observable<boolean> {
    return this.booleanSubject.asObservable();
  }

  getDataObservable(): Observable<HeaderNav[]> {
    return this.dataObservable;
  }

  addHeaderNav(nav: HeaderNav): void {
    this.headerNavList.push(nav);
    const uniqueItemsMap = new Map<string, HeaderNav>();
    this.headerNavList.forEach((item) => {
      uniqueItemsMap.set(item.name, item);
    });
    this.headerNavList = Array.from(uniqueItemsMap.values());
    const headerNav = JSON.stringify(this.headerNavList)
    localStorage.setItem("headerNavList", headerNav);
    
    if (this.dataObserver) {
      this.dataObserver.next(this.headerNavList);
    }
  }
  
  removeHeaderNavById(id: number): void {
    this.headerNavList = this.headerNavList.filter(nav => nav.id !== id);
    const headerNav = JSON.stringify(this.headerNavList)
    localStorage.setItem("headerNavList", headerNav);
  }

  getSelectedDocumentInfo() {
    return this.selectedDocumentInfo;
  }

  getColumnInfoObservable(): Observable<any> {
    return this.columnInfoObservable;
  }

  triggerCellChangeEvent() {
    this.triggerCellChangeSubject.next();
  }

  addDocument(doc: Fmeadocument) {
    this.documentList.push(doc);
    if(this.documentObserver) {
      this.documentObserver.next(this.documentList);
    }
    const documentList = JSON.stringify(this.documentList)
    localStorage.setItem("documentList", documentList);
  }

  getStorageLanguage(key: string): Observable<string | null> {
    return this.localStorageLanguage.asObservable();
  }

  setStorageLanguage(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.localStorageLanguage.next(value);
  }
  removeDocumentID(id: number): void {
    this.documentList = this.documentList.filter(doc => doc.DocumentID !== id);
    const doclist = JSON.stringify(this.documentList)
    localStorage.setItem("documentList", doclist);
  }

  setDocTabIndex(value: number): void {
    this.DocTabIndexSubject.next(value);
  }

  getDocTabIndex(): Observable<number> {
    return this.selectedDocTabIndex;
  }

  commonAlertBox(
    alertTitle: string, 
    alertMessage: string,
    alertClass: string,
    primaryBtnLabel: string,
    secondaryBtn?: boolean,
    secondaryBtnLabel?: string
  ) {
    const dialogBody = `
      <div class="dialog-title">
        <p><span class="dl-help-fill"></span> ` + alertTitle + `</p>
        <button id="confirmDialogClose" class="close-btn">
          <span class="dl-close"></span>
        </button>
      </div>
      <p>` + alertMessage + `</p>
    `;

    const dialogAction = [
      { text: primaryBtnLabel, onClick: () => true, elementAttr: {class: 'primary'} }
    ];

    if(secondaryBtn) {
      dialogAction.push({ text: secondaryBtnLabel, onClick: () => false, elementAttr: {class: 'secondary'} });
    }

    this.commonAlertBoxDialog = custom({
      messageHtml: dialogBody,
      dragEnabled: false,
      buttons: dialogAction
    });

    this.commonAlertBoxDialog.show();

    const overlayContent = document.querySelector('.dx-dialog-wrapper');
    if(overlayContent) {
      overlayContent.classList.add('custom-dx-dialog', alertClass);
    }

    const confirmDialogClose = document.querySelector('#confirmDialogClose');
    if(confirmDialogClose) {
      this.renderer.listen(confirmDialogClose, 'click', (event) => {
        event.preventDefault();
        this.commonAlertBoxDialog.hide();
      });
    }
  }

  featureNotImplemented(target: string) {
    this.showFeatureAlert = true;
    this.featureName = target;

    setTimeout(() => {
      this.showFeatureAlert = false;
    }, 2000);
  }

//#region Fmea_globalsettings
  IsFlagBitSet(nFlag: number, nBit: number): boolean {
    return (nFlag & nBit) != 0;
  }

  getPreferencevalue() {
    return this.apiCall.postMethodKey('apiurl', {}, 'Catalogue/GetPreferenceValue', {});
  }
 //#endregion fmea global settings

 //#region filter-action
 private ClearSubject = new Subject<void>();
 clearobservable = this.ClearSubject.asObservable();
 clearSortings(){
   this.ClearSubject.next();
 }

 private sortSubject = new Subject<string>();
  sortObservable = this.sortSubject.asObservable();
  emitSortEvent(order: string): void {
    this.sortSubject.next(order);
  }

  private columnChooserSubject = new Subject<void>();
  columnChooserAction$ = this.columnChooserSubject.asObservable();
  triggerColumnChooser() {
    this.columnChooserSubject.next();
  }

  private bestFitSubject = new Subject<void>();
  bestFitAction$ = this.bestFitSubject.asObservable();
  triggerBestFit() {
    this.bestFitSubject.next();
  }
 //#endregion filter-action

}