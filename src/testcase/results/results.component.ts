// src/app/tester/results/results.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TestCaseService } from 'src/app/shared/services/test-case.service';
import { TestCase } from 'src/app/shared/data/dummy-testcases';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  private testCaseService = inject(TestCaseService);

  selectedModule = '';
  showTable = false;
  filterStatus: 'All' | 'Pass' | 'Fail' | 'Pending' = 'All';
  modules = this.testCaseService.getModules();
  testCasePool = this.testCaseService.getTestCases();

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
    const pass = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pass').length;
    const fail = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Fail').length;
    const pending = this.filteredByModule.filter((_, i) => this.getStatus(i) === 'Pending').length;
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
 copyTestCaseLink(testCaseId: string): void {
  const baseUrl = window.location.origin;
  const copyUrl = `${baseUrl}/tester/view-testcase/${testCaseId}`;
  
  navigator.clipboard.writeText(copyUrl).then(() => {
    alert('Test case link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

}
