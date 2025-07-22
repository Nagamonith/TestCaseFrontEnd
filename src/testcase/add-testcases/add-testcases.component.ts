import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';

/** Lightweight component: choose module + version, manage lists, export to Excel. */
@Component({
  selector: 'app-add-testcases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css'],
})
export class AddTestcasesComponent {
  /** ── State via signals ─────────────────────────────────── */
  selectedModule = signal<string | null>(null);
  selectedVersion = signal<string | null>(null);

  showAddModuleForm = false;
  showAddVersionForm = false;

  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';

  /** ── Master data ───────────────────────────────────────── */
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0'],
  };

  /** Computed list for the version <select>  */
  versions = computed(() => {
    const id = this.selectedModule();
    return id ? this.versionsByModule[id] ?? [] : [];
  });

  /** ── Module helpers ────────────────────────────────────── */
  onModuleChange(id: string) {
    this.selectedModule.set(id || null);
    this.selectedVersion.set(null);
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
    if (!name) return alert('Module name required');
    const id = `mod${this.modules.length + 1}`;
    this.modules.push({ id, name });
    this.versionsByModule[id] = [version];
    this.selectedModule.set(id);
    this.selectedVersion.set(version);
    this.cancelAddModule();
  }

  /** ── Version helpers ───────────────────────────────────── */
  onVersionChange(ver: string) {
    this.selectedVersion.set(ver || null);
    this.resetOverlays();
  }

  toggleAddVersionForm() {
    this.showAddVersionForm = !this.showAddVersionForm;
    this.newVersionName = '';
  }

  cancelAddVersionForm() {
    this.showAddVersionForm = false;
  }

  addNewVersion() {
    const ver = this.newVersionName.trim();
    const mod = this.selectedModule();
    if (!mod || !ver) return alert('Version required');
    if (this.versionsByModule[mod].includes(ver)) {
      return alert('Version already exists');
    }
    this.versionsByModule[mod].push(ver);
    this.selectedVersion.set(ver);
    this.cancelAddVersionForm();
  }

  /** ── Export helper ─────────────────────────────────────── */
  exportModuleToExcel() {
    const mod = this.selectedModule();
    const ver = this.selectedVersion();
    if (!mod || !ver) return;

    // Minimal sample data – replace with real data source
    const dummyRows = [
      {
        'Sl.No': 1,
        Version: ver,
        'Use Case': 'Sample',
        'Test Case ID': 'TC000',
        Scenario: 'Demo',
        Steps: '1. Do\n2. Something',
        'Expected Result': 'It should work',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(dummyRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TestCases');
    XLSX.writeFile(wb, `Module-${mod}-Version-${ver}.xlsx`);
  }

  /** ── Internal ──────────────────────────────────────────── */
  private resetOverlays() {
    this.showAddModuleForm = false;
    this.showAddVersionForm = false;
  }
}