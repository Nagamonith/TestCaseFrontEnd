import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TestCase {
  slNo: number;
  moduleId: string;
  version: string;
  fixed: {
    slNo: number;
    useCase: string;
    testCaseId: string;
    scenario: string;
    steps: string;
    expected: string;
  };
  dynamic: { key: string; value: string }[];
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  /* ---------------------------------------------------
     State
  --------------------------------------------------- */
  selectedModule: string = '';
  showTable = false;
  filterStatus: 'All' | 'Pass' | 'Fail' | 'Pending' = 'All';

  /* ---------------------------------------------------
     Dummy data
  --------------------------------------------------- */
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

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
        expected: 'Admin dashboard opens'
      },
      dynamic: [
        { key: 'Priority', value: 'High' },
        { key: 'Device', value: 'Chrome' }
      ]
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
        expected: 'User remains logged in'
      },
      dynamic: [{ key: 'Priority', value: 'Medium' }]
    },
    {
      slNo: 3,
      moduleId: 'mod2',
      version: 'v2.0',
      fixed: {
        slNo: 1,
        useCase: 'Monthly Report Generation',
        testCaseId: 'TC201',
        scenario: 'User generates a PDF report for current month',
        steps: '1. Go to Reports\n2. Select current month\n3. Click Generate',
        expected: 'PDF report is downloaded'
      },
      dynamic: [{ key: 'Browser', value: 'Firefox' }]
    }
  ];

  /* ---------------------------------------------------
     Helper functions
  --------------------------------------------------- */
  // Cycles Pass/Fail/Pending based on index (dummy logic)
  private getStatus(index: number): 'Pass' | 'Fail' | 'Pending' {
    const mod = index % 3;
    return mod === 0 ? 'Pass' : mod === 1 ? 'Fail' : 'Pending';
  }

  // List for current module only
  private get filteredByModule(): TestCase[] {
    return this.selectedModule
      ? this.testCasePool.filter(tc => tc.moduleId === this.selectedModule)
      : [];
  }

  // Combines testcase + dummy status and applies filterStatus
  get tableData(): { tc: TestCase; status: 'Pass' | 'Fail' | 'Pending' }[] {
    return this.filteredByModule
      .map((tc, i) => ({ tc, status: this.getStatus(i) }))
      .filter(row =>
        this.filterStatus === 'All' ? true : row.status === this.filterStatus
      );
  }

  // Metadata counts
  get stats() {
    const total = this.filteredByModule.length;
    const pass = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pass').length;
    const fail = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Fail').length;
    const pending = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pending').length;
    return { total, pass, fail, pending };
  }

  /* ---------------------------------------------------
     Event handlers
  --------------------------------------------------- */
  onModuleChange(id: string) {
    this.selectedModule = id;
    this.showTable = false;      // reset table view
    this.filterStatus = 'All';   // reset filter
  }

  getModuleName(id: string): string {
    const mod = this.modules.find(m => m.id === id);
    return mod ? mod.name : '';
  }
}
