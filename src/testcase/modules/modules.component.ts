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
import {
  ActivatedRoute,
  ParamMap,
  RouterModule,
} from '@angular/router';

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
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent implements OnInit {
  /** Route‑driven selected module */
  selectedModule = signal<string | null>(null);

  filter = {
    slNo: '',
    testCaseId: '',
    useCase: '',
    result: '',
  };

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
  ];

  // --- Test‑case data -------------------------------------------------------
  testCasePool: TestCase[] = [
    {
      slNo: 1,
      moduleId: 'mod1',
      version: 'v1.0',
      fixed: {
        slNo: 1,
        useCase: 'Login as Admin',
        testCaseId: 'TC101',
        scenario: 'Admin logs in with valid credentials',
        steps:
          '1. Open login page\n2. Enter username/password\n3. Click login',
        expected: 'Admin dashboard opens',
      },
      dynamic: [
        { key: 'Priority', value: 'High' },
        { key: 'Device', value: 'Chrome' },
      ],
    },
    {
      slNo: 2,
      moduleId: 'mod1',
      version: 'v1.1',
      fixed: {
        slNo: 2,
        useCase: 'Remember Me Feature',
        testCaseId: 'TC102',
        scenario:
          'User remains logged in when remember me is checked',
        steps:
          '1. Check "Remember Me"\n2. Login\n3. Close tab\n4. Reopen site',
        expected: 'User remains logged in',
      },
      dynamic: [{ key: 'Priority', value: 'Medium' }],
    },
    {
      slNo: 1,
      moduleId: 'mod2',
      version: 'v2.0',
      fixed: {
        slNo: 1,
        useCase: 'Monthly Report Generation',
        testCaseId: 'TC201',
        scenario:
          'User generates a PDF report for current month',
        steps:
          '1. Go to Reports\n2. Select current month\n3. Click Generate',
        expected: 'PDF report is downloaded',
      },
      dynamic: [{ key: 'Browser', value: 'Firefox' }],
    },
  ];

  formArray = new FormArray<FormGroup>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  /* --------------------------------------------------------------------- */
  /* Lifecycle                                                             */
  /* --------------------------------------------------------------------- */

  ngOnInit(): void {
    // Read :moduleId whenever the route changes
    this.route.paramMap.subscribe((pm: ParamMap) => {
      const modId = pm.get('moduleId');
      if (modId && this.isValidModule(modId)) {
        this.onModuleChange(modId);
      } else {
        // Clear selection if url has no / invalid module id
        this.onModuleChange('');
      }
    });
  }

  /* --------------------------------------------------------------------- */
  /* View helpers                                                          */
  /* --------------------------------------------------------------------- */

  formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  /** All test‑cases for the selected module (or empty list) */
  filteredTestCases(): TestCase[] {
    const mod = this.selectedModule();
    return mod
      ? this.testCasePool.filter((tc) => tc.moduleId === mod)
      : [];
  }

  /** Filtered using search boxes + result filter */
  filteredAndSearchedTestCases(): TestCase[] {
    return this.filteredTestCases().filter((tc, i) => {
      const form = this.formGroups()[i];
      return (
        (!this.filter.slNo ||
          tc.slNo.toString().includes(this.filter.slNo)) &&
        (!this.filter.testCaseId ||
          tc.fixed.testCaseId
            .toLowerCase()
            .includes(this.filter.testCaseId.toLowerCase())) &&
        (!this.filter.useCase ||
          tc.fixed.useCase
            .toLowerCase()
            .includes(this.filter.useCase.toLowerCase())) &&
        (!this.filter.result ||
          form.get('result')?.value === this.filter.result)
      );
    });
  }

  /* --------------------------------------------------------------------- */
  /* Actions                                                               */
  /* --------------------------------------------------------------------- */

  onModuleChange(id: string): void {
    this.selectedModule.set(id || null);

    // Reset & rebuild formArray to match rows
    this.formArray.clear();
    for (const _ of this.filteredTestCases()) {
      this.formArray.push(
        new FormGroup({
          result: new FormControl('Pending'),
          actual: new FormControl(''),
          remarks: new FormControl(''),
        }),
      );
    }
  }

  onSave(): void {
    console.log(
      `✅ Saved results for module '${this.selectedModule()}':`,
      this.formArray.value,
    );
    alert('Results saved (dummy). Check console.');
  }

  /* --------------------------------------------------------------------- */
  /* Utilities                                                             */
  /* --------------------------------------------------------------------- */

  private isValidModule(id: string): boolean {
    return this.modules.some((m) => m.id === id);
  }
}
