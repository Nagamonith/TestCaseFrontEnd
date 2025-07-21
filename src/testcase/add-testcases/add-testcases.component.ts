import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css'],
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
  newModuleVersion = '';
  newVersionName = '';

  savedDynamicAttributes: { key: string; value: string }[] = [];

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0'],
  };

  dummyTestCases: TestCase[] = [
    {
      slNo: 1,
      moduleId: 'mod1',
      version: 'v1.0',
      fixed: {
        slNo: 1,
        useCase: 'Login as Admin',
        testCaseId: 'TC101',
        scenario: 'Admin logs in with valid creds',
        steps: '1. Go to login\n2. Enter creds\n3. Click login',
        expected: 'Admin dashboard opens',
      },
      dynamic: [
        { key: 'Priority', value: 'High' },
        { key: 'Device', value: 'Chrome' },
      ],
    },
  ];

  form = this.fb.group({
    moduleId: '',
    version: '',
    fixed: this.fb.group({
      slNo: 0,
      useCase: '',
      testCaseId: '',
      scenario: '',
      steps: '',
      expected: '',
    }),
    dynamic: this.fb.array([] as any[]),
  });

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
          (tc.fixed.testCaseId?.toLowerCase() ?? '').includes(q) ||
          (tc.fixed.useCase?.toLowerCase() ?? '').includes(q)
        )
    );
  });

  onModuleChange(id: string) {
    this.selectedModule.set(id || null);
    this.selectedVersion.set(null);
    this.resetOverlays();
  }

  onVersionChange(ver: string) {
    this.selectedVersion.set(ver || null);
    this.showForm = false;
    this.showEditSearch = false;
  }

  toggleAddModule() { this.showAddModuleForm = true; }
  cancelAddModule() {
    this.showAddModuleForm = false;
    this.newModuleName = '';
    this.newModuleVersion = '';
  }
  saveModule() {
    const name = this.newModuleName.trim();
    const version = this.newModuleVersion.trim() || 'v1.0';
    if (!name) return alert('Module name required');

    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    this.modules.push({ id, name });
    this.versionsByModule[id] = [version];

    this.selectedModule.set(id);
    this.selectedVersion.set(version);
    this.cancelAddModule();
  }

  toggleAddVersionForm() {
    this.showAddVersionForm = true;
    this.newVersionName = '';
  }
  cancelAddVersionForm() {
    this.showAddVersionForm = false;
    this.newVersionName = '';
  }
  addNewVersion() {
    const ver = this.newVersionName.trim();
    const mod = this.selectedModule();
    if (!mod) return;
    if (!ver) return alert('Version required');
    if (this.versionsByModule[mod].includes(ver))
      return alert('Version already exists');

    this.versionsByModule[mod].push(ver);
    this.selectedVersion.set(ver);
    this.showAddVersionForm = false;
  }

  toggleEditSearch() {
    this.showEditSearch = !this.showEditSearch;
    this.searchQuery.set('');
  }

  editTestCase(tc: TestCase) {
    this.form.patchValue({
      moduleId: tc.moduleId,
      version: tc.version,
      fixed: { ...tc.fixed },
    });

    this.dynamic.clear();
    tc.dynamic.forEach((attr) =>
      this.dynamic.push(this.fb.group({ key: attr.key, value: attr.value }))
    );

    this.savedDynamicAttributes = [...tc.dynamic];
    this.showForm = true;
    this.showEditSearch = false;
  }

  openTestCaseForm() {
    this.form.reset();
    this.dynamic.clear();
    this.savedDynamicAttributes = [];

    this.form.patchValue({
      moduleId: this.selectedModule(),
      version: this.selectedVersion(),
      fixed: { slNo: 0 },
    });
    this.showForm = true;
  }

  closeTestCaseForm() {
    this.showForm = false;
    this.savedDynamicAttributes = [];
  }

  addDynamicField() {
    this.dynamic.push(this.fb.group({ key: '', value: '' }));
  }

  removeDynamicField(i: number) {
    this.dynamic.removeAt(i);
  }

  onSubmit() {
    const data = this.form.value as unknown as TestCase;
    const nextSlNo = this.dummyTestCases.length + 1;
    const inputSlNo = data.fixed?.slNo ?? 0;
    const finalSlNo = inputSlNo > 0 ? inputSlNo : nextSlNo;

    data.slNo = finalSlNo;
    data.fixed.slNo = finalSlNo;

    const idx = this.dummyTestCases.findIndex(
      (tc) =>
        tc.moduleId === data.moduleId &&
        tc.version === data.version &&
        tc.fixed.testCaseId === data.fixed.testCaseId
    );

    if (idx >= 0) {
      this.dummyTestCases[idx] = data;
    } else {
      this.dummyTestCases.push(data);
    }

    this.savedDynamicAttributes = [...data.dynamic];

    alert('✅ Test case saved!');
    this.dynamic.clear();
  }

  exportModuleToExcel() {
    const mod = this.selectedModule();
    if (!mod) return;

    const data = this.dummyTestCases
      .filter(tc => tc.moduleId === mod)
      .map(tc => ({
        SlNo: tc.slNo,
        Version: tc.version,
        UseCase: tc.fixed.useCase,
        TestCaseID: tc.fixed.testCaseId,
        Scenario: tc.fixed.scenario,
        Steps: tc.fixed.steps,
        Expected: tc.fixed.expected,
        ...Object.fromEntries(tc.dynamic.map(attr => [attr.key, attr.value])),
      }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCases');

    XLSX.writeFile(workbook, `${mod}-TestCases.xlsx`);
  }

  private resetOverlays() {
    this.showForm = false;
    this.showEditSearch = false;
    this.showAddVersionForm = false;
    this.savedDynamicAttributes = [];
  }


saveOnlyDynamicAttributes() {
  this.savedDynamicAttributes = this.dynamic.controls.map(ctrl => ({
    key: ctrl.get('key')?.value,
    value: ctrl.get('value')?.value,
  }));
  this.dynamic.clear();
}

}
