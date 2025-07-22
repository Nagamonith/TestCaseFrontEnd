// ✅ edit-testcases.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface TestCase {
  id: string;
  moduleId: string;
  version: string;
  useCase: string;
  testCaseId: string;
  scenario: string;
  steps: string;
  expected: string;
  attributes: { key: string; value: string }[];
}

@Component({
  selector: 'app-edit-testcases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './edit-testcases.component.html',
  styleUrls: ['./edit-testcases.component.css'],
})
export class EditTestcasesComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery = signal('');
  selectedModule = signal<string>('');
  selectedVersion = signal<string>('');
  showForm = signal(false);
  editingId = signal<string | null>(null);

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reporting Module' },
  ];

  testCases = signal<TestCase[]>([
    {
      id: '1',
      moduleId: 'mod1',
      version: 'v1.0',
      useCase: 'Login success',
      testCaseId: 'TC001',
      scenario: 'Valid credentials',
      steps: 'Enter username, password, click login',
      expected: 'Dashboard opens',
      attributes: [],
    },
    {
      id: '2',
      moduleId: 'mod1',
      version: 'v1.0',
      useCase: 'Login fail',
      testCaseId: 'TC002',
      scenario: 'Invalid password',
      steps: 'Enter wrong password, click login',
      expected: 'Show error message',
      attributes: [],
    },
    {
      id: '3',
      moduleId: 'mod1',
      version: 'v1.1',
      useCase: 'Password reset',
      testCaseId: 'TC003',
      scenario: 'Forgot password link',
      steps: 'Click forgot password, enter email',
      expected: 'Reset link sent',
      attributes: [],
    },
    {
      id: '4',
      moduleId: 'mod2',
      version: 'v2.0',
      useCase: 'Generate report',
      testCaseId: 'TC004',
      scenario: 'Select date range',
      steps: 'Pick dates, click generate',
      expected: 'PDF download',
      attributes: [],
    },
    {
      id: '5',
      moduleId: 'mod2',
      version: 'v2.0',
      useCase: 'Filter report',
      testCaseId: 'TC005',
      scenario: 'Apply filters',
      steps: 'Select filter, click apply',
      expected: 'Filtered data shown',
      attributes: [],
    },
    {
      id: '6',
      moduleId: 'mod2',
      version: 'v2.0',
      useCase: 'Download report',
      testCaseId: 'TC006',
      scenario: 'Download in Excel',
      steps: 'Click export button',
      expected: 'Excel file downloaded',
      attributes: [],
    },
  ]);

  form = this.fb.group({
    id: [''],
    moduleId: ['', Validators.required],
    version: ['', Validators.required],
    useCase: ['', Validators.required],
    testCaseId: ['', Validators.required],
    scenario: ['', Validators.required],
    steps: ['', Validators.required],
    expected: ['', Validators.required],
    attributes: this.fb.array([]),
  });

  constructor() {
    const moduleId = this.route.snapshot.paramMap.get('moduleId');
    const version = this.route.snapshot.paramMap.get('version');

    if (moduleId) {
      this.selectedModule.set(moduleId);
      this.form.patchValue({ moduleId });
    }
    if (version) {
      this.selectedVersion.set(version);
      this.form.patchValue({ version });
    }
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  filteredTestCases = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const moduleId = this.selectedModule();
    const version = this.selectedVersion();

    return this.testCases().filter(
      (tc) =>
        tc.moduleId === moduleId &&
        tc.version === version &&
        (!query ||
          tc.testCaseId.toLowerCase().includes(query) ||
          tc.useCase.toLowerCase().includes(query) ||
          tc.scenario.toLowerCase().includes(query))
    );
  });

  getModuleName(id: string): string {
    return this.modules.find((m) => m.id === id)?.name || id;
  }

  getUniqueAttributes(): string[] {
    const allKeys = this.testCases().flatMap((tc) =>
      tc.attributes.map((attr) => attr.key)
    );
    return Array.from(new Set(allKeys));
  }

  getAttributeValue(testCase: TestCase, key: string): string {
    const attr = testCase.attributes.find((a) => a.key === key);
    return attr ? attr.value : '';
  }

  trackByAttribute(_index: number, attr: string): string {
    return attr;
  }

  addAttribute(key = '', value = '') {
    this.attributes.push(
      this.fb.group({
        key: [key, Validators.required],
        value: [value],
      })
    );
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  openForm() {
    this.form.reset({
      moduleId: this.selectedModule(),
      version: this.selectedVersion(),
    });
    this.attributes.clear();
    this.editingId.set(null);
    this.showForm.set(true);
  }

  editTestCase(testCase: TestCase) {
    this.form.patchValue({ ...testCase });
    this.attributes.clear();
    testCase.attributes.forEach((attr) =>
      this.addAttribute(attr.key, attr.value)
    );
    this.editingId.set(testCase.id);
    this.showForm.set(true);
  }

  saveTestCase() {
    if (this.form.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const attrRaw = this.attributes.getRawValue() as {
      key: string;
      value: string;
    }[];
    const v = this.form.value;

    const testCase: TestCase = {
      id: v.id || Date.now().toString(),
      moduleId: this.selectedModule(),
      version: this.selectedVersion(),
      useCase: v.useCase!,
      testCaseId:
        v.testCaseId?.trim() ||
        `TC${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
      scenario: v.scenario!,
      steps: v.steps!,
      expected: v.expected!,
      attributes: attrRaw,
    };

    const list = [...this.testCases()];
    const idx = list.findIndex((tc) => tc.id === testCase.id);
    idx >= 0 ? (list[idx] = testCase) : list.push(testCase);
    this.testCases.set(list);

    this.showForm.set(false);
  }

  deleteTestCase(id: string) {
    if (confirm('Are you sure you want to delete this test case?')) {
      const updated = this.testCases().filter((tc) => tc.id !== id);
      this.testCases.set(updated);
    }
  }

  cancelForm() {
    this.showForm.set(false);
  }

  goBack() {
    this.router.navigate(['/tester/add-testcases']);
  }
}
