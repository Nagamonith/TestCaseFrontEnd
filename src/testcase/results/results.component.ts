import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  // Dummy data
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0']
  };

  resultsByModuleVersion: Record<string, any[]> = {
    'mod1-v1.0': [
      { result: 'Pass' },
      { result: 'Fail' },
      { result: 'Pending' }
    ],
    'mod2-v2.0': [
      { result: 'Pass' },
      { result: 'Pass' },
      { result: 'Pass' }
    ]
  };

  selectedModule = signal('');
  selectedVersion = signal('');

  stats = computed(() => {
    const mod = this.selectedModule();
    const ver = this.selectedVersion();
    const key = `${mod}-${ver}`;
    const data = this.resultsByModuleVersion[key] || [];

    const total = data.length;
    const pass = data.filter(r => r.result === 'Pass').length;
    const fail = data.filter(r => r.result === 'Fail').length;
    const pending = data.filter(r => r.result === 'Pending').length;

    return { total, pass, fail, pending };
  });

  azureReportUrl = computed(() => {
    const mod = this.selectedModule();
    const ver = this.selectedVersion();
    if (!mod || !ver) return '';
    return `/assets/azure-reports/${mod}-${ver}.html`; // local dummy file path
  });
}
