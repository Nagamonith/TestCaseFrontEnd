import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-extra-adds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extra-adds.component.html',
  styleUrls: ['./extra-adds.component.css']
})
export class ExtraAddsComponent {
  modules = signal<{ id: string; name: string }[]>([
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ]);
  
  versionsByModule = signal<Record<string, string[]>>({
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0', 'v2.1']
  });

  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';
  selectedModuleId = '';

  showAddModuleForm = false;
  showAddVersionForm = false;

  toggleAddModule() {
    this.showAddModuleForm = !this.showAddModuleForm;
    if (this.showAddModuleForm) {
      this.newModuleName = '';
      this.newModuleVersion = 'v1.0';
    }
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
    this.selectedModuleId = id;
    this.showAddModuleForm = false;
  }

  toggleAddVersionForm() {
    if (!this.selectedModuleId) {
      alert('Please select a module first');
      return;
    }
    this.showAddVersionForm = !this.showAddVersionForm;
    if (this.showAddVersionForm) {
      this.newVersionName = '';
    }
  }

  saveVersion() {
    const version = this.newVersionName.trim();
    
    if (!this.selectedModuleId) {
      alert('No module selected');
      return;
    }
    
    if (!version) {
      alert('Version name is required');
      return;
    }

    const versions = this.versionsByModule()[this.selectedModuleId] || [];
    
    if (versions.includes(version)) {
      alert('Version already exists for this module');
      return;
    }

    this.versionsByModule.update(map => {
      const updated = [...(map[this.selectedModuleId] || []), version];
      return { ...map, [this.selectedModuleId]: updated };
    });
    
    this.showAddVersionForm = false;
    this.newVersionName = '';
  }
}