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

import { DUMMY_TEST_CASES, TestCase } from 'src/app/shared/data/dummy-testcases';

type TestCaseFilter = {
  slNo: string;
  testCaseId: string;
  useCase: string;
};

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

  selectedModule = signal<string>('');
  selectedVersion = signal<string>('');
  showForm = signal(false);
  editingId = signal<string | null>(null);

  filter = signal<TestCaseFilter>({
    slNo: '',
    testCaseId: '',
    useCase: '',
  });

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reporting Module' },
  ];

  testCases = signal<TestCase[]>(DUMMY_TEST_CASES);

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
    const moduleId = this.selectedModule();
    const version = this.selectedVersion();
    const f = this.filter();

    return this.testCases()
      .filter((tc) => tc.moduleId === moduleId && tc.version === version)
      .filter((tc) =>
        (!f.slNo || tc.slNo.toString().includes(f.slNo)) &&
        (!f.testCaseId || tc.testCaseId.toLowerCase().includes(f.testCaseId.toLowerCase())) &&
        (!f.useCase || tc.useCase.toLowerCase().includes(f.useCase.toLowerCase()))
      );
  });

  updateFilter<K extends keyof TestCaseFilter>(key: K, value: string) {
    this.filter.set({
      ...this.filter(),
      [key]: value,
    });
  }

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

    const currentList = this.testCases();
    const nextSlNo =
      v.id && currentList.find((tc) => tc.id === v.id)?.slNo
        ? currentList.find((tc) => tc.id === v.id)!.slNo
        : currentList.length
        ? Math.max(...currentList.map((tc) => tc.slNo)) + 1
        : 1;

    const testCase: TestCase = {
      slNo: nextSlNo,
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

    const list = [...currentList];
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
