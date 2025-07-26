// src/app/tester/add-testcases/add-testcases.component.ts
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { TestCaseService } from 'src/app/shared/services/test-case.service';
import { AutoSaveService } from 'src/app/shared/services/auto-save.service';

@Component({
  selector: 'app-add-testcases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css'],
})
export class AddTestcasesComponent {
  private testCaseService = inject(TestCaseService);
  // private autoSaveService = inject(AutoSaveService);
  // ngOnInit(): void {
  //   this.autoSaveService.start(() => this.exportModuleToExcel());
  // }

  // ngOnDestroy(): void {
  //   this.autoSaveService.stop();
  // }

  selectedModule = signal<string | null>(null);
  selectedVersion = signal<string | null>(null);
  showAddModuleForm = false;
  showAddVersionForm = false;
  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';

  modules = this.testCaseService.getModules();
  testCases = this.testCaseService.getTestCases();

  versions = computed(() => {
    const id = this.selectedModule();
    return id ? this.testCaseService.getVersionsByModule(id) : [];
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

    const newId = this.testCaseService.addModule(name, version);
    this.selectedModule.set(newId);
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

    if (this.versions().includes(version)) {
      alert('Version already exists');
      return;
    }

    this.testCaseService.addVersion(mod, version);
    this.selectedVersion.set(version);
    this.cancelAddVersionForm();
  }

  exportModuleToExcel() {
    const modId = this.selectedModule();
    if (!modId) {
      alert('Please select a module first.');
      return;
    }

    const module = this.modules.find(m => m.id === modId);
    if (!module) return;

    const versions = this.testCaseService.getVersionsByModule(modId);
    const wb = XLSX.utils.book_new();

    versions.forEach(version => {
      const filteredTestCases = this.testCases.filter(
        tc => tc.moduleId === modId && tc.version === version
      );

      if (filteredTestCases.length === 0) return;

      const rows = filteredTestCases.map((tc, index) => ({
        'Sl.No': index + 1,
        'Module Name': module.name,
        Version: version,
        'Use Case': tc.useCase,
        'Test Case ID': tc.testCaseId,
        Scenario: tc.scenario,
        Steps: tc.steps,
        'Expected Result': tc.expected,
        ...tc.attributes.reduce((acc, attr) => {
          acc[attr.key] = attr.value;
          return acc;
        }, {} as Record<string, string>)
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, `Version-${version}`);
    });

    XLSX.writeFile(wb, `${module.name.replace(/\s+/g, '_')}_All_Versions.xlsx`);
  }

  private resetOverlays() {
    this.showAddModuleForm = false;
    this.showAddVersionForm = false;
  }
}