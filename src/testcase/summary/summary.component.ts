import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

  versions = ['v1.0', 'v1.1', 'v2.0'];

  testMatrix: Record<string, number> = {
    'mod1-v1.0': 5,
    'mod1-v1.1': 3,
    'mod2-v2.0': 7
  };

  getCount(modId: string, ver: string): number {
    return this.testMatrix[`${modId}-${ver}`] || 0;
  }

  getVersionTotal(ver: string): number {
    return this.modules.reduce((sum, mod) => sum + this.getCount(mod.id, ver), 0);
  }
} 