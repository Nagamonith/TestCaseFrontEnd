import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DUMMY_TEST_CASES, TestCase } from 'src/app/shared/data/dummy-testcases';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  testCases: TestCase[] = DUMMY_TEST_CASES;

  // Dynamically derived modules
  get modules(): { id: string; name: string }[] {
    const uniqueIds = Array.from(new Set(this.testCases.map(tc => tc.moduleId)));
    return uniqueIds.map(id => ({
      id,
      name: this.getModuleName(id),
    }));
  }

  // Dynamically derived versions
  get versions(): string[] {
    return Array.from(new Set(this.testCases.map(tc => tc.version)));
  }

  // Test count matrix by module-version
  get testMatrix(): Record<string, number> {
    const map: Record<string, number> = {};
    for (const tc of this.testCases) {
      const key = `${tc.moduleId}-${tc.version}`;
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }

  getCount(modId: string, ver: string): number {
    return this.testMatrix[`${modId}-${ver}`] ?? 0;
  }

  getVersionTotal(ver: string): number {
    return this.modules.reduce((sum, mod) => sum + this.getCount(mod.id, ver), 0);
  }

  getModuleName(id: string): string {
    const names: Record<string, string> = {
      mod1: 'Login Module',
      mod2: 'Reports Module',
      mod3: 'Profile Module',
      mod4: 'Cart Module',
      mod5: 'Search Module',
      mod6: 'Upload Module',
      mod7: 'Settings Module',
    };
    return names[id] || `Module ${id}`;
  }
}
