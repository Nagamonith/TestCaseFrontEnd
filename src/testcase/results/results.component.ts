import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  selectedModule: string = '';
  showTable = false;
  filterStatus: 'All' | 'Pass' | 'Fail' | 'Pending' = 'All';

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
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
  ];

  private getStatus(index: number): 'Pass' | 'Fail' | 'Pending' {
    const mod = index % 3;
    return mod === 0 ? 'Pass' : mod === 1 ? 'Fail' : 'Pending';
  }

  private get filteredByModule(): TestCase[] {
    return this.selectedModule
      ? this.testCasePool.filter((tc) => tc.moduleId === this.selectedModule)
      : [];
  }

  get tableData(): { tc: TestCase; status: 'Pass' | 'Fail' | 'Pending' }[] {
    return this.filteredByModule
      .map((tc, i) => ({ tc, status: this.getStatus(i) }))
      .filter((row) =>
        this.filterStatus === 'All' ? true : row.status === this.filterStatus
      );
  }

  get stats() {
    const total = this.filteredByModule.length;
    const pass = this.filteredByModule.filter(
      (_, i) => this.getStatus(i) === 'Pass'
    ).length;
    const fail = this.filteredByModule.filter(
      (_, i) => this.getStatus(i) === 'Fail'
    ).length;
    const pending = this.filteredByModule.filter(
      (_, i) => this.getStatus(i) === 'Pending'
    ).length;
    return { total, pass, fail, pending };
  }

  onModuleChange(id: string) {
    this.selectedModule = id;
    this.showTable = false;
    this.filterStatus = 'All';
  }

  getModuleName(id: string): string {
    const mod = this.modules.find((m) => m.id === id);
    return mod ? mod.name : '';
  }

  exportToExcel(): void {
    if (!this.selectedModule || this.tableData.length === 0) return;

    const rows = this.tableData.map((row) => {
      const dynamicObj = Object.fromEntries(
        row.tc.dynamic.map((d) => [d.key, d.value])
      );
      return {
        'Sl. No': row.tc.fixed.slNo,
        'Test Case ID': row.tc.fixed.testCaseId,
        'Use Case': row.tc.fixed.useCase,
        Scenario: row.tc.fixed.scenario,
        Steps: row.tc.fixed.steps,
        Expected: row.tc.fixed.expected,
        Actual: `Actual output ${row.tc.fixed.slNo}`,
        Result: row.status,
        Remarks: `Remarks for test ${row.tc.fixed.slNo}`,
        ...dynamicObj,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      this.getModuleName(this.selectedModule)
    );

    const wbArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbArray], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = `${this.getModuleName(this.selectedModule)}_results.xlsx`.replace(
      /\s+/g,
      '_'
    );
    saveAs(blob, fileName);
  }
}
