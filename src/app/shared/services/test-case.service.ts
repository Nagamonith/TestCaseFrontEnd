// src/app/shared/services/test-case.service.ts
import { Injectable, signal } from '@angular/core';
import { TestCase, DUMMY_TEST_CASES } from '../data/dummy-testcases';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {
  private testCases = signal<TestCase[]>(DUMMY_TEST_CASES);
  private modules = signal([
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
    { id: 'mod3', name: 'Profile Module' },
    { id: 'mod4', name: 'Cart Module' },
    { id: 'mod5', name: 'Search Module' },
    { id: 'mod6', name: 'Upload Module' },
    { id: 'mod7', name: 'Settings Module' }
  ]);

  getTestCases() {
    return this.testCases();
  }

  getModules() {
    return this.modules();
  }

  getVersionsByModule(moduleId: string) {
    return Array.from(new Set(
      this.testCases()
        .filter(tc => tc.moduleId === moduleId)
        .map(tc => tc.version)
    ));
  }

  addTestCase(testCase: TestCase) {
    // Ensure uploads field exists
    const completeCase: TestCase = {
      ...testCase,
      uploads: testCase.uploads || []
    };
    this.testCases.update(current => [...current, completeCase]);
  }

  updateTestCase(updatedCase: TestCase) {
    // Ensure uploads field exists
    const completeCase: TestCase = {
      ...updatedCase,
      uploads: updatedCase.uploads || []
    };
    this.testCases.update(current => 
      current.map(tc => tc.id === completeCase.id ? completeCase : tc)
    );
  }

  deleteTestCase(id: string) {
    this.testCases.update(current => current.filter(tc => tc.id !== id));
  }

  addModule(name: string, initialVersion = 'v1.0') {
    const newId = `mod${this.modules().length + 1}`;
    this.modules.update(current => [...current, { id: newId, name }]);

    // Add an initial test case to the new module and version
    this.addTestCase({
      slNo: this.testCases().length + 1,
      id: Date.now().toString(),
      moduleId: newId,
      version: initialVersion,
      testCaseId: `TC${Math.floor(Math.random() * 1000)}`,
      useCase: 'Initial test case',
      scenario: 'Initial scenario',
      steps: 'Initial steps',
      expected: 'Initial expectation',
      attributes: [],
      uploads: []
    });

    return newId;
  }

  addVersion(moduleId: string, version: string) {
    // Add a test case to initialize the version
    this.addTestCase({
      slNo: this.testCases().length + 1,
      id: Date.now().toString(),
      moduleId,
      version,
      testCaseId: `TC${Math.floor(Math.random() * 1000)}`,
      useCase: 'Initial test case for new version',
      scenario: 'Initial scenario',
      steps: 'Initial steps',
      expected: 'Initial expectation',
      attributes: [],
      uploads: []
    });
  }
}
