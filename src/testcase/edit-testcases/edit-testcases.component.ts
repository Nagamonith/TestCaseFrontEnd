// ▸ edit-testcases.component.ts (updated to remove `Priority` and `Browser`)
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

/* ───────── Models ───────── */
interface TestCaseFixed {
  slNo: number;
  useCase: string;
  testCaseId: string;
  scenario: string;
  steps: string;
  expected: string;
}
interface DynamicAttribute { key: string; value: string; }
interface TestCase {
  slNo: number;
  moduleId: string;
  version: string;
  fixed: TestCaseFixed;
  dynamic: DynamicAttribute[]; // ← may now be empty
}

@Component({
  selector   : 'app-edit-testcases',
  standalone : true,
  imports    : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-testcases.component.html',
  styleUrls  : ['./edit-testcases.component.css'],
})
export class EditTestcasesComponent {
  /* ───────── DI ───────── */
  private fb   = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  /* ───────── Selections ───────── */
  selectedModule  = '';
  selectedVersion = '';

  /* Simple filter model */
  filter = { slNo: '', testCaseId: '', useCase: '', result: '' };

  /* Demo module list */
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
  ];

  /* 👉 Dynamic attributes `Priority` & `Browser` have been removed */
  testCases: TestCase[] = [
    {
      slNo     : 1,
      moduleId : 'mod1',
      version  : 'v1.0',
      fixed    : {
        slNo     : 1,
        useCase  : 'Login as Admin',
        testCaseId: 'TC101',
        scenario : 'Admin logs in with valid credentials',
        steps    : '1. Open login page\n2. Enter username/password\n3. Click login',
        expected : 'Admin dashboard opens',
      },
      dynamic: [], // ← now empty
    },
    {
      slNo     : 2,
      moduleId : 'mod1',
      version  : 'v1.0',
      fixed    : {
        slNo     : 2,
        useCase  : 'Remember Me',
        testCaseId: 'TC102',
        scenario : 'Stay logged in when remember‑me is checked',
        steps    : '1. Check remember‑me\n2. Login\n3. Close and reopen browser',
        expected : 'User remains logged in',
      },
      dynamic: [], // ← now empty
    },
  ];

  /* One reactive row per test‑case */
  readonly formArray = new FormArray<FormGroup>([]);

  /* ───────── ctor ───────── */
  constructor() {
    this.selectedModule  = this.route.snapshot.paramMap.get('moduleId') ?? '';
    this.selectedVersion = this.route.snapshot.paramMap.get('version')  ?? '';
    this.buildForms();
  }

  /* ───────── Helpers ───────── */
  getModuleName(): string {
    return (
      this.modules.find(m => m.id === this.selectedModule)?.name ||
      this.selectedModule ||
      ''
    );
  }

  /** primary filter */
  filteredTestCases(): TestCase[] {
    return this.testCases.filter(
      tc => tc.moduleId === this.selectedModule && tc.version === this.selectedVersion,
    );
  }

  /** collect dynamic keys (Priority/Browser already absent) */
  dynamicKeys(): string[] {
    const keys = new Set<string>();
    this.filteredTestCases().forEach(tc => tc.dynamic.forEach(d => keys.add(d.key)));
    return Array.from(keys);
  }

  /** value resolver used in template */
  getDynamicValue(tc: TestCase, key: string): string {
    return tc.dynamic.find(d => d.key === key)?.value ?? '‑';
  }

  formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  filteredAndSearched(): TestCase[] {
    return this.filteredTestCases().filter((tc, i) => {
      const fg = this.formGroups()[i];
      return (
        (!this.filter.slNo       || tc.slNo.toString().includes(this.filter.slNo)) &&
        (!this.filter.testCaseId || tc.fixed.testCaseId.toLowerCase().includes(this.filter.testCaseId.toLowerCase())) &&
        (!this.filter.useCase    || tc.fixed.useCase    .toLowerCase().includes(this.filter.useCase.toLowerCase())) &&
        (!this.filter.result     || fg.get('result')?.value === this.filter.result)
      );
    });
  }

  /* ───────── Form builder ───────── */
  private buildForms(): void {
    this.formArray.clear();
    this.filteredTestCases().forEach(() =>
      this.formArray.push(
        this.fb.group({
          result : ['Pending'],
          actual : [''],
          remarks: [''],
        }),
      ),
    );
  }

  /* ───────── Actions ───────── */
  onSave(): void {
    console.log('✅ Saved data:', this.formArray.value);
    alert('Results saved (dummy).');
  }

  editRow(tc: TestCase): void {
    alert(`Edit test‑case ${tc.slNo} (stub)`);
  }

  deleteRow(tc: TestCase): void {
    if (confirm(`Delete test‑case ${tc.slNo}?`)) {
      this.testCases = this.testCases.filter(t => t.slNo !== tc.slNo);
      this.buildForms();
    }
  }
}
