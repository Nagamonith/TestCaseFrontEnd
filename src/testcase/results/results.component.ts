import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { DUMMY_TEST_CASES, TestCase } from 'src/app/shared/data/dummy-testcases';

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

  // ✅ Import shared test cases
  testCasePool: TestCase[] = DUMMY_TEST_CASES;

  /** Dummy result mapping */
  private getStatus(index: number): 'Pass' | 'Fail' | 'Pending' {
    const mod = index % 3;
    return mod === 0 ? 'Pass' : mod === 1 ? 'Fail' : 'Pending';
  }

  /** Filter test cases based on selected module */
  private get filteredByModule(): TestCase[] {
    return this.selectedModule
      ? this.testCasePool.filter((tc) => tc.moduleId === this.selectedModule)
      : [];
  }

  /** Table rows with test case and status */
  get tableData(): { tc: TestCase; status: 'Pass' | 'Fail' | 'Pending' }[] {
    return this.filteredByModule
      .map((tc, i) => ({ tc, status: this.getStatus(i) }))
      .filter((row) =>
        this.filterStatus === 'All' ? true : row.status === this.filterStatus
      );
  }

  /** Summary stats */
  get stats() {
    const total = this.filteredByModule.length;
    const pass = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pass').length;
    const fail = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Fail').length;
    const pending = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pending').length;
    return { total, pass, fail, pending };
  }

  /** Handle dropdown change */
  onModuleChange(id: string) {
    this.selectedModule = id;
    this.showTable = false;
    this.filterStatus = 'All';
  }

  /** Get module name */
  getModuleName(id: string): string {
    const mod = this.modules.find((m) => m.id === id);
    return mod ? mod.name : '';
  }

  /** Export visible data to Excel */
  exportToExcel(): void {
    if (!this.selectedModule || this.tableData.length === 0) return;
const rows = this.tableData.map((row) => {
  const dynamicObj = row.tc.attributes.reduce((acc, attr) => {
    acc[attr.key] = attr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    'Sl. No': row.tc.slNo,
    'Test Case ID': row.tc.testCaseId,
    'Use Case': row.tc.useCase,
    'Scenario': row.tc.scenario,
    'Steps': row.tc.steps,
    'Expected': row.tc.expected,
    'Actual': `Actual output ${row.tc.slNo}`,
    'Result': row.status,
    'Remarks': `Remarks for test ${row.tc.slNo}`,
    ...dynamicObj,
  };
});



    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.getModuleName(this.selectedModule));

    const wbArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = `${this.getModuleName(this.selectedModule)}_results.xlsx`.replace(/\s+/g, '_');
    saveAs(blob, fileName);
  }
}
