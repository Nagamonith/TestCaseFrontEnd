import { Component, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { DUMMY_TEST_CASES, TestCase } from 'src/app/shared/data/dummy-testcases';

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

  moduleNameMap: Record<string, string> = {
    mod1: 'Login Module',
    mod2: 'Reports Module',
    mod3: 'Profile Module',
    mod4: 'Cart Module',
    mod5: 'Search Module',
    mod6: 'Upload Module',
    mod7: 'Settings Module',
  };

  modules: { id: string; name: string }[] = [];
  testCasePool = DUMMY_TEST_CASES;
  formArray = new FormArray<FormGroup>([]);

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const moduleIds = Array.from(new Set(this.testCasePool.map(tc => tc.moduleId)));
    this.modules = moduleIds.map(id => ({
      id,
      name: this.moduleNameMap[id] ?? id,
    }));

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
    if (!this.isValidModule(id)) return;

    this.selectedModule.set(id);
    this.selectedVersion = '';
    this.versionTestCases.set([]);
    this.showViewTestCases = false;
    this.showStartTesting = false;

    if (id) {
      this.availableVersions = [
        ...new Set(
          this.testCasePool
            .filter(tc => tc.moduleId === id)
            .map(tc => tc.version)
        ),
      ];
    } else {
      this.availableVersions = [];
    }

    this.formArray.clear();
    for (const _ of this.filteredTestCases()) {
      this.formArray.push(
        new FormGroup({
          result: new FormControl('Pending'),
          actual: new FormControl(''),
          remarks: new FormControl(''),
        })
      );
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

  onSave(): void {
    console.log(`✅ Saved results for module '${this.selectedModule()}':`, this.formArray.value);
    alert('Results saved (dummy). Check console.');
  }

  private isValidModule(id: string): boolean {
    return this.modules.some(m => m.id === id);
  }
}
