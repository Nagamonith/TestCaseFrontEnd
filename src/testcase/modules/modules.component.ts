import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
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

  // Popup state
  popupIndex: number | null = null;
  popupField: 'actual' | 'remarks' | null = null;
  isPopupOpen: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      const modId = pm.get('moduleId');
      const fallback = this.modules.length ? this.modules[0].id : null;
      this.onModuleChange(modId ?? fallback ?? '');
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  handleDocumentClick(event: MouseEvent): void {
    if (this.isPopupOpen && this.popupIndex !== null) {
      const target = event.target as HTMLElement;
      if (!target.closest('.popup-box') && !target.closest('td[style*="position: relative"]')) {
        this.closePopup(this.popupIndex);
      }
    }
  }

  getFormControl(index: number, controlName: string): FormControl {
    const control = this.formGroups()[index].get(controlName);
    if (!control) {
      throw new Error(`Form control '${controlName}' not found`);
    }
    return control as FormControl;
  }

  openPopup(index: number, field: 'actual' | 'remarks', event: MouseEvent) {
    event.stopPropagation();
    this.popupIndex = index;
    this.popupField = field;
    this.isPopupOpen = true;
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  closePopup(index: number) {
    this.isPopupOpen = false;
    this.popupIndex = null;
    this.popupField = null;
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
    this.cdRef.detectChanges();
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
      return (
        (!this.filter.slNo || tc.slNo.toString().includes(this.filter.slNo)) &&
        (!this.filter.testCaseId ||
          tc.testCaseId.toLowerCase().includes(this.filter.testCaseId.toLowerCase())) &&
        (!this.filter.useCase ||
          tc.useCase.toLowerCase().includes(this.filter.useCase.toLowerCase())) &&
        (!this.filter.result || form.get('result')?.value === this.filter.result)
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

    if (id) {
      this.availableVersions = this.testCaseService.getVersionsByModule(id);
    } else {
      this.availableVersions = [];
    }

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

  onUpload($event: Event, index: number): void {
    const target = $event.target as HTMLInputElement;
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
      result: formValues[index].result,
      actual: formValues[index].actual,
      remarks: formValues[index].remarks,
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
}