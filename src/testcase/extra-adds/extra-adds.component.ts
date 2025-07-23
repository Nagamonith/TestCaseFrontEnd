import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  // Products for dropdown
  products: Product[] = [
    // { id: 'p1', name: 'General' },
    { id: 'p2', name: 'Wizard' },
    { id: 'p3', name: 'Qualis SPC' },
    { id: 'p4', name: 'MSA' },
    { id: 'p5', name: 'FMEA' },
    { id: 'p6', name: 'APQP' }
  ];

  selectedProductId = '';

  // Modules and versions state
  modules = signal<Module[]>([
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ]);

  versionsByModule = signal<Record<string, string[]>>({
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0', 'v2.1']
  });

  // UI state
  showModulesList = false;
  showAddModuleForm = false;
  showAddVersionForm = false;

  // Form data
  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';
  selectedModuleId = '';

  /** Toggle module list display */
  toggleModulesList() {
    this.showModulesList = !this.showModulesList;
  }

  /** Save a new module and its initial version */
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

  /** Enable editing for selected module */
  startEditing(module: Module) {
    this.modules.update(mods =>
      mods.map(m => m.id === module.id ? { ...m, editing: true } : m)
    );
  }

  /** Save changes made to a module */
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

  /** Delete a module and its versions */
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

  /** Show add version form */
  initAddVersion() {
    if (this.modules().length === 0) {
      alert('No modules available. Please add a module first.');
      return;
    }

    this.selectedModuleId = '';
    this.newVersionName = '';
    this.showAddVersionForm = true;
  }

  /** Save new version for selected module */
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
