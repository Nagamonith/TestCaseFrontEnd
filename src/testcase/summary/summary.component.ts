import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  // Dummy module/version grid
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

  versions = ['v1.0', 'v1.1', 'v2.0'];

  // Dummy matrix: moduleId-version → test case count
  testMatrix: Record<string, number> = {
    'mod1-v1.0': 5,
    'mod1-v1.1': 3,
    'mod2-v2.0': 7
  };

  getCount(modId: string, ver: string): number {
    return this.testMatrix[`${modId}-${ver}`] || 0;
  }
}
