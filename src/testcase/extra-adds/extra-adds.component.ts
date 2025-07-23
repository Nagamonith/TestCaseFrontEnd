import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DUMMY_TEST_CASES } from 'src/app/shared/data/dummy-testcases';

interface Module {
  id: string;
  name: string;
  editing?: boolean;
}

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-extra-adds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extra-adds.component.html',
  styleUrls: ['./extra-adds.component.css']
})
export class ExtraAddsComponent {
  products: Product[] = [
    { id: 'p2', name: 'Wizard' },
    { id: 'p3', name: 'Qualis SPC' },
    { id: 'p4', name: 'MSA' },
    { id: 'p5', name: 'FMEA' },
    { id: 'p6', name: 'APQP' }
  ];

  selectedProductId = '';

  // Extracted modules and versions from DUMMY_TEST_CASES
  private rawModules = Array.from(
    new Set(DUMMY_TEST_CASES.map(tc => tc.moduleId))
  );

  private moduleNamesMap: Record<string, string> = {
    mod1: 'Login Module',
    mod2: 'Reports Module',
    mod3: 'Profile Module',
    mod4: 'Cart Module',
    mod5: 'Search Module',
    mod6: 'Upload Module',
    mod7: 'Settings Module'
  };

  modules = signal<Module[]>(
    this.rawModules.map(id => ({
      id,
      name: this.moduleNamesMap[id] || id
    }))
  );

  versionsByModule = signal<Record<string, string[]>>(
    DUMMY_TEST_CASES.reduce((acc, tc) => {
      if (!acc[tc.moduleId]) acc[tc.moduleId] = [];
      if (!acc[tc.moduleId].includes(tc.version)) {
        acc[tc.moduleId].push(tc.version);
      }
      return acc;
    }, {} as Record<string, string[]>)
  );

  // UI state
  showModulesList = false;
  showAddModuleForm = false;
  showAddVersionForm = false;

  // Form data
  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';
  selectedModuleId = '';

  toggleModulesList() {
    this.showModulesList = !this.showModulesList;
  }

  saveModule() {
    const name = this.newModuleName.trim();
    const version = this.newModuleVersion.trim() || 'v1.0';

    if (!name) {
      alert('Module name is required');
      return;
    }

    const id = `mod${this.modules().length + 1}`;
    this.modules.update(mods => [...mods, { id, name }]);

    this.versionsByModule.update(map => ({
      ...map,
      [id]: [version]
    }));

    this.newModuleName = '';
    this.newModuleVersion = 'v1.0';
    this.showAddModuleForm = false;
  }

  startEditing(module: Module) {
    this.modules.update(mods =>
      mods.map(m => m.id === module.id ? { ...m, editing: true } : m)
    );
  }

  saveEditing(module: Module) {
    const name = module.name.trim();
    if (!name) {
      alert('Module name cannot be empty');
      return;
    }

    this.modules.update(mods =>
      mods.map(m => m.id === module.id ? { ...m, editing: false } : m)
    );
  }

  deleteModule(moduleId: string) {
    if (confirm('Are you sure you want to delete this module?')) {
      this.modules.update(mods => mods.filter(m => m.id !== moduleId));

      this.versionsByModule.update(map => {
        const updated = { ...map };
        delete updated[moduleId];
        return updated;
      });
    }
  }

  initAddVersion() {
    if (this.modules().length === 0) {
      alert('No modules available. Please add a module first.');
      return;
    }

    this.selectedModuleId = '';
    this.newVersionName = '';
    this.showAddVersionForm = true;
  }

  saveVersion() {
    const version = this.newVersionName.trim();

    if (!this.selectedModuleId) {
      alert('Please select a module');
      return;
    }

    if (!version) {
      alert('Version name is required');
      return;
    }

    const existingVersions = this.versionsByModule()[this.selectedModuleId] || [];
    if (existingVersions.includes(version)) {
      alert('Version already exists for this module');
      return;
    }

    this.versionsByModule.update(map => {
      const updated = [...existingVersions, version];
      return { ...map, [this.selectedModuleId]: updated };
    });

    this.newVersionName = '';
    this.selectedModuleId = '';
    this.showAddVersionForm = false;
  }
}
