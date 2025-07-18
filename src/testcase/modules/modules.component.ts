import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

/* --- typed helpers ---------------------------------------- */
interface TestCase {
  id: number;
  scenario: string;
  expected: string;
}
type ModuleId = 'mod1' | 'mod2';
type Version  = 'v1.0' | 'v1.1' | 'v2.0';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
  /* dropdown state */
  selectedModule: ModuleId | '' = '';
  selectedVersion: Version  | '' = '';

  /* dropdown data */
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];
  versionsByModule: Record<ModuleId, Version[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0']
  };

  /* main matrix of test cases */
  allTestCases: Record<ModuleId, Record<Version, TestCase[]>> = {
    mod1: {
      'v1.0': [
        { id: 1, scenario: 'Login with valid creds', expected: 'Dashboard loads' },
        { id: 2, scenario: 'Login with invalid creds', expected: 'Error message' }
      ],
      'v1.1': [
        { id: 3, scenario: 'Remember Me check', expected: 'User remains logged in' }
      ],
      'v2.0': []
    },
    mod2: {
      'v1.0': [],
      'v1.1': [],
      'v2.0': [
        { id: 1, scenario: 'Generate monthly report', expected: 'PDF downloaded' }
      ]
    }
  };

  /* form to capture results */
  formArray = new FormArray<FormGroup>([]);

  constructor(private fb: FormBuilder) {}

  /* refresh table whenever dropdown changes */
  onModuleVersionChange() {
    this.formArray.clear();
    for (const _ of this.testCases()) {
      this.formArray.push(
        new FormGroup({
          result:  new FormControl(''),
          actual:  new FormControl(''),
          remarks: new FormControl('')
        })
      );
    }
  }

  /* helper used by template */
  testCases(): TestCase[] {
    if (!this.selectedModule || !this.selectedVersion) return [];
    return this.allTestCases[this.selectedModule][this.selectedVersion] ?? [];
  }

  formGroups() {
    return this.formArray.controls as FormGroup[];
  }

  onSave() {
    console.log('✅ Saved Test Results:', this.formArray.value);
    alert('Test results saved (dummy). Check console.');
  }
  get currentVersions(): string[] {
  return this.versionsByModule[this.selectedModule as keyof typeof this.versionsByModule] || [];
}

}
