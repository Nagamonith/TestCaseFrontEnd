import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

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

  /* ────────── reactive signals ────────── */
  selectedModule = signal<string | null>(null);
  selectedVersion = signal<string | null>(null);
  searchQuery = signal('');                               // ✅ was string, now signal

  /* ────────── ui state flags ────────── */
  showForm = false;
  showAddModuleForm = false;
  showAddVersionForm = false;
  showEditSearch = false;

  /* ────────── temp inputs ────────── */
  newModuleName = '';
  newModuleVersion = '';
  newVersionName = '';

  /* ────────── sample data ────────── */
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

  /* ────────── main form ────────── */
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

  /* ────────── computed helpers ────────── */
  versions = computed(() => {
    const id = this.selectedModule();
    return id ? this.versionsByModule[id] ?? [] : [];
  });

  filteredResults = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();    // ✅ use signal value
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

  /* ────────── module / version handlers ────────── */
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

  /* ----- add module ----- */
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

  /* ----- add version ----- */
  toggleAddVersionForm() {
    this.showAddVersionForm = true;
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

  /* ----- search / edit ----- */
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

    this.showForm = true;
    this.showEditSearch = false;
  }

  /* ----- new test case ----- */
  openTestCaseForm() {
    this.form.reset();
    this.dynamic.clear();
    this.form.patchValue({
      moduleId: this.selectedModule(),
      version: this.selectedVersion(),
      fixed: { slNo: 0 },
    });
    this.showForm = true;
  }
  closeTestCaseForm() { this.showForm = false; }

  /* ----- dynamic attr helpers ----- */
  addDynamicField() { this.dynamic.push(this.fb.group({ key: '', value: '' })); }
  removeDynamicField(i: number) { this.dynamic.removeAt(i); }

  /* ----- save test case ----- */
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

    idx >= 0 ? (this.dummyTestCases[idx] = data) : this.dummyTestCases.push(data);

    alert('✅ Test case saved!');
    this.form.reset();
    this.dynamic.clear();
    this.showForm = false;
  }

  /* ────────── helpers ────────── */
  private resetOverlays() {
    this.showForm = false;
    this.showEditSearch = false;
    this.showAddVersionForm = false;
  }
}
