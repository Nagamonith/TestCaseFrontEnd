import { Component, OnInit, signal, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class ModulesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private testCaseService = inject(TestCaseService);

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

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      const modId = pm.get('moduleId');
      const fallback = this.modules.length ? this.modules[0].id : null;
      this.onModuleChange(modId ?? fallback ?? '');
    });
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
        (!this.filter.testCaseId || tc.testCaseId.toLowerCase().includes(this.filter.testCaseId.toLowerCase())) &&
        (!this.filter.useCase || tc.useCase.toLowerCase().includes(this.filter.useCase.toLowerCase())) &&
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
    for (const _ of testCases) {
      this.formArray.push(
        this.fb.group({
          result: ['Pending'],
          actual: [''],
          remarks: [''],
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
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploads[index].push(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    console.log('✅ Saved results:', this.formArray.value);
    console.log('📎 Uploads:', this.uploads);
    alert('Results and uploads saved (dummy). Check console.');
  }

  getModuleName(id: string): string {
    const mod = this.modules.find(m => m.id === id);
    return mod ? mod.name : `Module ${id}`;
  }
}
