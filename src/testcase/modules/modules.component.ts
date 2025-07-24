import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { TestCaseService } from 'src/app/shared/services/test-case.service';
import { TestCase } from 'src/app/shared/data/dummy-testcases';

interface Filter {
  slNo: string;
  testCaseId: string;
  useCase: string;
  result: string;
  attributeKey?: string;
  attributeValue?: string;
}

type TestCaseField = keyof Omit<TestCase, 'attributes'> | `attr_${string}`;

interface TableColumn {
  field: TestCaseField | 'attributes' | string;
  header: string;
  width: number;
  noResize?: boolean;
  isAttribute?: boolean;
}

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private testCaseService = inject(TestCaseService);
  private cdRef = inject(ChangeDetectorRef);

  selectedModule = signal<string | null>(null);
  selectedVersion = '';
  availableVersions: string[] = [];
  versionTestCases = signal<TestCase[]>([]);
  showViewTestCases = false;
  showStartTesting = false;
  availableAttributes: string[] = [];
  attributeColumns: TableColumn[] = [];

  filter: Filter = {
    slNo: '',
    testCaseId: '',
    useCase: '',
    result: '',
  };

  modules = this.testCaseService.getModules();
  testCasePool = this.testCaseService.getTestCases();
  formArray = new FormArray<FormGroup>([]);
  uploads: (string | ArrayBuffer | null)[][] = [];

  popupIndex: number | null = null;
  popupField: 'actual' | 'remarks' | null = null;
  isPopupOpen: boolean = false;

  isResizing = false;
  currentResizeColumn: TableColumn | null = null;
  startX = 0;
  startWidth = 0;

  // ✅ Bound methods
  private boundHandleClick = this.handleDocumentClick.bind(this);
  private boundOnResize = this.onResize.bind(this);
  private boundStopResize = this.stopResize.bind(this);

  viewColumns: TableColumn[] = [
    { field: 'slNo', header: 'Sl No', width: 80 },
    { field: 'useCase', header: 'Use Case', width: 150 },
    { field: 'testCaseId', header: 'Test Case ID', width: 120 },
    { field: 'scenario', header: 'Scenario', width: 200 },
    { field: 'steps', header: 'Steps', width: 200 },
    { field: 'expected', header: 'Expected', width: 200 }
  ];

  testColumns: TableColumn[] = [
    { field: 'slNo', header: 'Sl No', width: 80 },
    { field: 'version', header: 'Version', width: 100 },
    { field: 'useCase', header: 'Use Case', width: 150 },
    { field: 'testCaseId', header: 'Test Case ID', width: 120 },
    { field: 'scenario', header: 'Scenario', width: 200 },
    { field: 'steps', header: 'Steps', width: 200 },
    { field: 'expected', header: 'Expected', width: 200 },
    { field: 'result', header: 'Result', width: 120 },
    { field: 'actual', header: 'Actual', width: 200 },
    { field: 'remarks', header: 'Remarks', width: 200 },
    { field: 'uploads', header: 'Uploads', width: 150 }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      const modId = pm.get('moduleId');
      const fallback = this.modules.length ? this.modules[0].id : null;
      this.onModuleChange(modId ?? fallback ?? '');
    });
    this.extractAvailableAttributes();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.boundHandleClick);
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundStopResize);
  }

  extractAvailableAttributes(): void {
    const allAttributes = new Set<string>();
    this.testCasePool.forEach(tc => {
      tc.attributes?.forEach(attr => {
        allAttributes.add(attr.key);
      });
    });
    this.availableAttributes = Array.from(allAttributes);
  }

  getAttributeValue(testCase: TestCase, key: string): string {
    const attr = testCase.attributes?.find(a => a.key === key);
    return attr ? attr.value : '';
  }

  addAttributeColumn(key: string): void {
    if (!this.attributeColumns.some(col => col.field === `attr_${key}`)) {
      this.attributeColumns.push({
        field: `attr_${key}`,
        header: key,
        width: 150,
        isAttribute: true
      });
    }
  }

  startResize(event: MouseEvent, column: TableColumn): void {
    if (column.noResize) return;

    this.isResizing = true;
    this.currentResizeColumn = column;
    this.startX = event.pageX;
    this.startWidth = column.width;

    event.preventDefault();
    event.stopPropagation();

    document.addEventListener('mousemove', this.boundOnResize);
    document.addEventListener('mouseup', this.boundStopResize);
  }

  onResize(event: MouseEvent): void {
    if (this.isResizing && this.currentResizeColumn) {
      const dx = event.pageX - this.startX;
      this.currentResizeColumn.width = Math.max(50, this.startWidth + dx);
      this.cdRef.detectChanges();
    }
  }

  stopResize(): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundStopResize);
  }

  private handleDocumentClick(event: MouseEvent) {
    if (this.isPopupOpen && this.popupIndex !== null) {
      const target = event.target as HTMLElement;
      const popupElement = document.querySelector('.popup-box');

      if (popupElement && !popupElement.contains(target)) {
        this.closePopup(this.popupIndex);
      }
    }
  }

  openPopup(index: number, field: 'actual' | 'remarks', event: MouseEvent) {
    event.stopPropagation();

    if (this.isPopupOpen && this.popupIndex !== null) {
      this.closePopup(this.popupIndex);
    }

    this.popupIndex = index;
    this.popupField = field;
    this.isPopupOpen = true;

    setTimeout(() => {
      document.addEventListener('click', this.boundHandleClick);
    });
  }

  closePopup(index: number) {
    if (this.popupIndex === index) {
      this.isPopupOpen = false;
      this.popupIndex = null;
      this.popupField = null;
      document.removeEventListener('click', this.boundHandleClick);
      this.cdRef.detectChanges();
    }
  }

  getFormControl(index: number, controlName: string): FormControl {
    const control = this.formGroups()[index].get(controlName);
    if (!control) throw new Error(`Form control '${controlName}' not found`);
    return control as FormControl;
  }

  formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  filteredTestCases(): TestCase[] {
    const mod = this.selectedModule();
    return mod ? this.testCasePool.filter(tc => tc.moduleId === mod) : [];
  }

  filteredAndSearchedTestCases(): TestCase[] {
    return this.filteredTestCases().filter((tc, i) => {
      const form = this.formGroups()[i];
      const matchesAttribute =
        !this.filter.attributeKey ||
        (this.filter.attributeValue &&
          this.getAttributeValue(tc, this.filter.attributeKey)
            .toLowerCase()
            .includes(this.filter.attributeValue.toLowerCase()));

      return (
        (!this.filter.slNo || tc.slNo.toString().includes(this.filter.slNo)) &&
        (!this.filter.testCaseId ||
          tc.testCaseId.toLowerCase().includes(this.filter.testCaseId.toLowerCase())) &&
        (!this.filter.useCase ||
          tc.useCase.toLowerCase().includes(this.filter.useCase.toLowerCase())) &&
        (!this.filter.result || form.get('result')?.value === this.filter.result) &&
        matchesAttribute
      );
    });
  }

  onModuleChange(id: string): void {
    if (!this.modules.some(m => m.id === id)) return;

    this.selectedModule.set(id);
    this.selectedVersion = '';
    this.versionTestCases.set([]);
    this.showViewTestCases = false;
    this.showStartTesting = false;

    this.availableVersions = this.testCaseService.getVersionsByModule(id);
    this.formArray.clear();
    const testCases = this.filteredTestCases();
    this.uploads = [];

    for (const testCase of testCases) {
      this.formArray.push(
        this.fb.group({
          result: [testCase.result || 'Pending'],
          actual: [testCase.actual || ''],
          remarks: [testCase.remarks || '']
        })
      );
      this.uploads.push([]);
    }
  }

  onVersionChange(): void {
    const mod = this.selectedModule();
    if (this.selectedVersion && mod) {
      const cases = this.testCasePool.filter(
        tc => tc.moduleId === mod && tc.version === this.selectedVersion
      );
      this.versionTestCases.set(cases);
    } else {
      this.versionTestCases.set([]);
    }
  }

  onUpload(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.uploads[index].push(reader.result);
          this.cdRef.detectChanges();
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  onSave(): void {
    const formValues = this.formArray.value;
    const testCases = this.filteredTestCases();

    const updatedTestCases = testCases.map((tc, index) => ({
      ...tc,
      result: formValues[index]?.result,
      actual: formValues[index]?.actual,
      remarks: formValues[index]?.remarks,
      uploads: this.uploads[index].map(u => u?.toString() || '')
    }));

    updatedTestCases.forEach(tc => this.testCaseService.updateTestCase(tc));
    this.testCasePool = [...this.testCaseService.getTestCases()];
    this.cdRef.detectChanges();
    alert('Results saved successfully!');
  }

  getModuleName(id: string): string {
    const mod = this.modules.find(m => m.id === id);
    return mod ? mod.name : `Module ${id}`;
  }

  getCellValue(testCase: TestCase, field: string): string {
    if (field.startsWith('attr_')) {
      const attrKey = field.substring(5);
      return this.getAttributeValue(testCase, attrKey);
    }
    const value = testCase[field as keyof TestCase];
    return value !== undefined && value !== null ? value.toString() : '';
  }
}
