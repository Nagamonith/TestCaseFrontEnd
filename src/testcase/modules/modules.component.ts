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
  selectedVersion: string = '';
  availableVersions: string[] = [];
  versionTestCases: TestCase[] = [];
  
  // View toggles
  showViewTestCases: boolean = false;
  showStartTesting: boolean = false;

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

  // Test‑case data
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
        steps: '1. Open login page\n2. Enter username/password\n3. Click login',
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
        scenario: 'User remains logged in when remember me is checked',
        steps: '1. Check "Remember Me"\n2. Login\n3. Close tab\n4. Reopen site',
        expected: 'User remains logged in',
      },
      dynamic: [{ key: 'Priority', value: 'Medium' }],
    },
    {
      slNo: 3,
      moduleId: 'mod1',
      version: 'v1.1',
      fixed: {
        slNo: 3,
        useCase: 'Password Reset',
        testCaseId: 'TC103',
        scenario: 'User resets forgotten password',
        steps: '1. Click "Forgot Password"\n2. Enter email\n3. Click reset link\n4. Set new password',
        expected: 'Password is changed and user can login with new password',
      },
      dynamic: [{ key: 'Priority', value: 'High' }],
    },
    {
      slNo: 1,
      moduleId: 'mod2',
      version: 'v2.0',
      fixed: {
        slNo: 1,
        useCase: 'Monthly Report Generation',
        testCaseId: 'TC201',
        scenario: 'User generates a PDF report for current month',
        steps: '1. Go to Reports\n2. Select current month\n3. Click Generate',
        expected: 'PDF report is downloaded',
      },
      dynamic: [{ key: 'Browser', value: 'Firefox' }],
    },
    {
      slNo: 2,
      moduleId: 'mod2',
      version: 'v2.1',
      fixed: {
        slNo: 2,
        useCase: 'Custom Date Range Report',
        testCaseId: 'TC202',
        scenario: 'User generates report for custom date range',
        steps: '1. Go to Reports\n2. Select custom date range\n3. Click Generate',
        expected: 'PDF report for selected dates is downloaded',
      },
      dynamic: [{ key: 'Browser', value: 'Chrome' }],
    },
  ];

  formArray = new FormArray<FormGroup>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      const modId = pm.get('moduleId');
      if (modId && this.isValidModule(modId)) {
        this.onModuleChange(modId);
      } else {
        this.onModuleChange('');
      }
    });
  }

  formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  filteredTestCases(): TestCase[] {
    const mod = this.selectedModule();
    return mod
      ? this.testCasePool.filter((tc) => tc.moduleId === mod)
      : [];
  }

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

  onModuleChange(id: string): void {
    this.selectedModule.set(id || null);
    this.selectedVersion = '';
    this.versionTestCases = [];
    this.showViewTestCases = false;
    this.showStartTesting = false;

    if (id) {
      // Get unique versions for the selected module
      this.availableVersions = [...new Set(
        this.testCasePool
          .filter(tc => tc.moduleId === id)
          .map(tc => tc.version)
      )];
    } else {
      this.availableVersions = [];
    }

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

  onVersionChange(): void {
    if (this.selectedVersion && this.selectedModule()) {
      this.versionTestCases = this.testCasePool.filter(
        tc => tc.moduleId === this.selectedModule() && 
              tc.version === this.selectedVersion
      );
    } else {
      this.versionTestCases = [];
    }
  }

  onSave(): void {
    console.log(
      `✅ Saved results for module '${this.selectedModule()}':`,
      this.formArray.value,
    );
    alert('Results saved (dummy). Check console.');
  }

  private isValidModule(id: string): boolean {
    return this.modules.some((m) => m.id === id);
  }
}