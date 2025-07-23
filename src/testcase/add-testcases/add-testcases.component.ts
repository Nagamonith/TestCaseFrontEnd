import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { DUMMY_TEST_CASES } from 'src/app/shared/data/dummy-testcases';



@Component({
  selector: 'app-add-testcases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css'],
})
export class AddTestcasesComponent {
  selectedModule = signal<string | null>(null);
  selectedVersion = signal<string | null>(null);

  showAddModuleForm = false;
  showAddVersionForm = false;

  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';

  testCases = DUMMY_TEST_CASES; // ✅ store dummy test cases

  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0', 'v2.1'],
  };

  versions = computed(() => {
    const id = this.selectedModule();
    return id ? this.versionsByModule[id] ?? [] : [];
  });

  onModuleChange(id: string) {
    this.selectedModule.set(id || null);
    this.selectedVersion.set(null);
    this.resetOverlays();
  }

  onVersionChange(ver: string) {
    this.selectedVersion.set(ver || null);
    this.resetOverlays();
  }

  toggleAddModule() {
    this.showAddModuleForm = !this.showAddModuleForm;
    this.newModuleName = '';
    this.newModuleVersion = 'v1.0';
  }

  cancelAddModule() {
    this.showAddModuleForm = false;
  }

  saveModule() {
    const name = this.newModuleName.trim();
    const version = this.newModuleVersion.trim() || 'v1.0';
    if (!name) {
      alert('Module name required');
      return;
    }

    const id = `mod${this.modules.length + 1}`;
    this.modules.push({ id, name });
    this.versionsByModule[id] = [version];

    this.selectedModule.set(id);
    this.selectedVersion.set(version);
    this.cancelAddModule();
  }

  toggleAddVersionForm() {
    this.showAddVersionForm = !this.showAddVersionForm;
    this.newVersionName = '';
  }

  cancelAddVersionForm() {
    this.showAddVersionForm = false;
  }

  addNewVersion() {
    const version = this.newVersionName.trim();
    const mod = this.selectedModule();
    if (!mod || !version) {
      alert('Version name is required');
      return;
    }

    const versions = this.versionsByModule[mod] || [];
    if (versions.includes(version)) {
      alert('Version already exists');
      return;
    }

    this.versionsByModule[mod].push(version);
    this.selectedVersion.set(version);
    this.cancelAddVersionForm();
  }

  exportModuleToExcel() {
    const modId = this.selectedModule();
    if (!modId) {
      alert('Please select a module first.');
      return;
    }

    const moduleName = this.modules.find(m => m.id === modId)?.name || modId;
    const versions = this.versionsByModule[modId] || [];

    const wb = XLSX.utils.book_new();

    versions.forEach((version) => {
      const filteredTestCases = this.testCases.filter(
        tc => tc.moduleId === modId && tc.version === version
      );

      if (filteredTestCases.length === 0) return;

      const rows = filteredTestCases.map((tc, index) => ({
        'Sl.No': index + 1,
        'Module Name': moduleName,
        Version: version,
        'Use Case': tc.useCase,
        'Test Case ID': tc.testCaseId,
        Scenario: tc.scenario,
        Steps: tc.steps,
        'Expected Result': tc.expected,
        ...tc.attributes // export dynamic attributes
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, `Version-${version}`);
    });

    XLSX.writeFile(wb, `${moduleName.replace(/\s+/g, '_')}_All_Versions.xlsx`);
  }

  private resetOverlays() {
    this.showAddModuleForm = false;
    this.showAddVersionForm = false;
  }
}
