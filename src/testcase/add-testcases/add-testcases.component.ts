import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

interface TestCase {
  slNo: number;
  moduleId: string;
  version: string;
  fixed: {
    useCase: string;
    testCaseId: string;
    scenario: string;
    steps: string;
    expected: string;
    slNo: number;
  };
  dynamic: { key: string; value: string }[];
}

@Component({
  selector: 'app-add-testcases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule,],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css']
})
export class AddTestcasesComponent {
  private fb = inject(FormBuilder);

  selectedModule = signal<string | null>(null);
  selectedVersion = signal<string | null>(null);
  searchQuery = signal('');

  showForm = false;
  showAddModuleForm = false;
  showAddVersionForm = false;
  showEditSearch = false;

  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';

  savedDynamicAttributes: { key: string; value: string }[] = [];

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0']
  };

  dummyTestCases: TestCase[] = [
    {
      slNo: 1,
      moduleId: 'mod1',
      version: 'v1.0',
      fixed: {
        slNo: 1,
        useCase: 'User Login',
        testCaseId: 'TC001',
        scenario: 'Valid user login',
        steps: '1. Enter username\n2. Enter password\n3. Click login',
        expected: 'User should be logged in successfully'
      },
      dynamic: [
        { key: 'Priority', value: 'High' },
        { key: 'Category', value: 'Authentication' }
      ]
    }
  ];

  form = this.fb.group({
    moduleId: ['', Validators.required],
    version: ['', Validators.required],
    fixed: this.fb.group({
      slNo: [0],
      useCase: ['', Validators.required],
      testCaseId: ['', Validators.required],
      scenario: ['', Validators.required],
      steps: ['', Validators.required],
      expected: ['', Validators.required]
    }),
    dynamic: this.fb.array([])
  });

  get fixed(): FormGroup {
    return this.form.get('fixed') as FormGroup;
  }

  get dynamic(): FormArray {
    return this.form.get('dynamic') as FormArray;
  }

  versions = computed(() => {
    const id = this.selectedModule();
    return id ? this.versionsByModule[id] ?? [] : [];
  });

  filteredResults = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const m = this.selectedModule();
    const v = this.selectedVersion();
    if (!q || !m || !v) return [];

    return this.dummyTestCases.filter(
      (tc) =>
        tc.moduleId === m &&
        tc.version === v &&
        (
          tc.slNo.toString().includes(q) ||
          tc.fixed.testCaseId.toLowerCase().includes(q) ||
          tc.fixed.useCase.toLowerCase().includes(q)
        )
    );
  });

  // MODULE METHODS
  onModuleChange(id: string) {
    this.selectedModule.set(id || null);
    this.selectedVersion.set(null);
    this.resetOverlays();
  }

  toggleAddModule() {
    this.showAddModuleForm = !this.showAddModuleForm;
    this.newModuleName = '';
    this.newModuleVersion = 'v1.0';
  }

  cancelAddModule() {
    this.showAddModuleForm = false;
  }

  saveModule() {
    const name = this.newModuleName.trim();
    const version = this.newModuleVersion.trim() || 'v1.0';
    if (!name) return alert('Module name required');

    const id = `mod${this.modules.length + 1}`;
    this.modules.push({ id, name });
    this.versionsByModule[id] = [version];
    this.selectedModule.set(id);
    this.selectedVersion.set(version);
    this.cancelAddModule();
  }

  // VERSION METHODS
  onVersionChange(ver: string) {
    this.selectedVersion.set(ver || null);
    this.resetOverlays();
  }

  toggleAddVersionForm() {
    this.showAddVersionForm = !this.showAddVersionForm;
    this.newVersionName = '';
  }

  cancelAddVersionForm() {
    this.showAddVersionForm = false;
  }

  addNewVersion() {
    const ver = this.newVersionName.trim();
    const mod = this.selectedModule();
    if (!mod || !ver) return alert('Version required');
    if (this.versionsByModule[mod].includes(ver)) {
      return alert('Version already exists');
    }
    this.versionsByModule[mod].push(ver);
    this.selectedVersion.set(ver);
    this.cancelAddVersionForm();
  }

  // TEST CASE METHODS
  toggleEditSearch() {
    this.showEditSearch = !this.showEditSearch;
    this.searchQuery.set('');
  }

  editTestCase(tc: TestCase) {
    this.form.patchValue({
      moduleId: tc.moduleId,
      version: tc.version,
      fixed: { ...tc.fixed }
    });
    this.savedDynamicAttributes = [...tc.dynamic];
    this.showForm = true;
    this.showEditSearch = false;
  }

  deleteTestCase(tc: TestCase) {
    if (confirm('Are you sure you want to delete this test case?')) {
      this.dummyTestCases = this.dummyTestCases.filter(item => item.slNo !== tc.slNo);
    }
  }

  openTestCaseForm() {
    this.form.reset();
    this.dynamic.clear();
    this.savedDynamicAttributes = [];
    this.form.patchValue({
      moduleId: this.selectedModule(),
      version: this.selectedVersion(),
      fixed: {
        slNo: this.dummyTestCases.length > 0 ?
          Math.max(...this.dummyTestCases.map(tc => tc.slNo)) + 1 : 1
      }
    });
    this.showForm = true;
  }

  closeTestCaseForm() {
    this.showForm = false;
    this.form.reset();
    this.dynamic.clear();
    this.savedDynamicAttributes = [];
  }

  // DYNAMIC ATTRIBUTE METHODS
  addDynamicField() {
    this.dynamic.push(this.fb.group({
      key: ['Attribute ' + (this.dynamic.length + 1), Validators.required],
      value: ['']
    }));
  }

  saveDynamicAttributes() {
    const newAttrs = this.dynamic.controls
      .filter(ctrl => ctrl.get('key')?.value?.trim())
      .map(ctrl => ({
        key: ctrl.get('key')?.value?.trim() || 'Unnamed Attribute',
        value: ctrl.get('value')?.value?.trim() || ''
      }));

    this.savedDynamicAttributes = [
      ...this.savedDynamicAttributes,
      ...newAttrs
    ];
    this.dynamic.clear();
  }

  saveDynamicAttribute(): void {
    this.saveDynamicAttributes();
  }

  cancelDynamicAttribute(): void {
    this.dynamic.clear();
  }

  removeDynamicField(index: number) {
    this.dynamic.removeAt(index);
  }

  removeSavedAttribute(index: number) {
    this.savedDynamicAttributes.splice(index, 1);
  }

  // FORM SUBMISSION
  onSubmit(): void {
    if (this.dynamic.length > 0) {
      this.saveDynamicAttributes();
    }

    if (this.form.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = this.form.value;
    const testCase: TestCase = {
      slNo: formData.fixed?.slNo || 0,
      moduleId: formData.moduleId || '',
      version: formData.version || '',
      fixed: {
        slNo: formData.fixed?.slNo || 0,
        useCase: formData.fixed?.useCase || '',
        testCaseId: formData.fixed?.testCaseId || '',
        scenario: formData.fixed?.scenario || '',
        steps: formData.fixed?.steps || '',
        expected: formData.fixed?.expected || ''
      },
      dynamic: [...this.savedDynamicAttributes]
    };

    const existingIndex = this.dummyTestCases.findIndex(tc => tc.slNo === testCase.slNo);
    if (existingIndex >= 0) {
      this.dummyTestCases[existingIndex] = testCase;
    } else {
      this.dummyTestCases.push(testCase);
    }

    alert('✅ Test case saved!');
    this.closeTestCaseForm();
  }
  get dynamicFirstGroup(): FormGroup {
  return this.dynamic.at(0) as FormGroup;
}


  // EXPORT TO EXCEL
  exportModuleToExcel() {
    const mod = this.selectedModule();
    if (!mod) return;

    const moduleName = this.modules.find(m => m.id === mod)?.name || mod;
    const version = this.selectedVersion();

    const data = this.dummyTestCases
      .filter(tc => tc.moduleId === mod && (!version || tc.version === version))
      .map(tc => ({
        'Sl.No': tc.slNo,
        'Version': tc.version,
        'Use Case': tc.fixed.useCase,
        'Test Case ID': tc.fixed.testCaseId,
        'Scenario': tc.fixed.scenario,
        'Steps': tc.fixed.steps,
        'Expected Result': tc.fixed.expected,
        ...Object.fromEntries(tc.dynamic.map(attr => [attr.key, attr.value]))
      }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCases');
    XLSX.writeFile(workbook, `${moduleName}-TestCases.xlsx`);
  }

  private resetOverlays() {
    this.showForm = false;
    this.showEditSearch = false;
    this.showAddVersionForm = false;
  }
}
