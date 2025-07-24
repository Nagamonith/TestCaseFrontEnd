// src/app/shared/services/test-case.service.ts
import { Injectable, signal } from '@angular/core';
import { TestCase, DUMMY_TEST_CASES } from '../data/dummy-testcases';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {
  private testCases = signal<TestCase[]>(DUMMY_TEST_CASES.map(tc => ({
    ...tc,
    result: tc.result || 'Pending', // Ensure all test cases have a result
    actual: tc.actual || '',
    remarks: tc.remarks || '',
    uploads: tc.uploads || []
  })));

  private modules = signal([
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' },
    { id: 'mod3', name: 'Profile Module' },
    { id: 'mod4', name: 'Cart Module' },
    { id: 'mod5', name: 'Search Module' },
    { id: 'mod6', name: 'Upload Module' },
    { id: 'mod7', name: 'Settings Module' }
  ]);

  getTestCases(): TestCase[] {
    return this.testCases();
  }

  getModules() {
    return this.modules();
  }

  getVersionsByModule(moduleId: string): string[] {
    return Array.from(new Set(
      this.testCases()
        .filter(tc => tc.moduleId === moduleId)
        .map(tc => tc.version)
    )).sort((a, b) => a.localeCompare(b)); // Sort versions alphabetically
  }

addTestCase(testCase: Omit<TestCase, 'id'> | TestCase): TestCase {
  const completeCase: TestCase = {
    ...testCase,
    id: 'id' in testCase ? testCase.id : Date.now().toString(), // Use existing ID or generate new one
    result: testCase.result || 'Pending',
    actual: testCase.actual || '',
    remarks: testCase.remarks || '',
    uploads: testCase.uploads || [],
    attributes: testCase.attributes || []
  };
  
  this.testCases.update(current => [...current, completeCase]);
  return completeCase;
}

  updateTestCase(updatedCase: TestCase): TestCase {
  const completeCase: TestCase = {
    ...updatedCase,
    result: updatedCase.result || 'Pending',
    actual: updatedCase.actual || '',
    remarks: updatedCase.remarks || '',
    uploads: updatedCase.uploads || []
  };

  this.testCases.update(current => 
    current.map(tc => tc.id === completeCase.id ? completeCase : tc)
  );
  
  return completeCase;
}

  deleteTestCase(id: string): boolean {
    const exists = this.testCases().some(tc => tc.id === id);
    if (exists) {
      this.testCases.update(current => current.filter(tc => tc.id !== id));
      return true;
    }
    return false;
  }
addModule(name: string, initialVersion = 'v1.0'): string {
  const newId = `mod${this.modules().length + 1}`;
  this.modules.update(current => [...current, { id: newId, name }]);

  // Add an initial test case to the new module and version
  this.addTestCase({
    slNo: this.getNextSlNoForModule(newId),
    moduleId: newId,
    version: initialVersion,
    testCaseId: `TC${this.generateTestCaseId()}`,
    useCase: 'Initial test case',
    scenario: 'Initial scenario',
    steps: 'Initial steps',
    expected: 'Initial expectation',
    result: 'Pending',
    actual: '',
    remarks: '',
    attributes: [],
    uploads: [],
    id: Date.now().toString() // Ensure unique ID
  });

  return newId;
}

addVersion(moduleId: string, version: string): TestCase {
  return this.addTestCase({
    slNo: this.getNextSlNoForModule(moduleId),
    moduleId,
    version,
    testCaseId: `TC${this.generateTestCaseId()}`,
    useCase: 'Initial test case for new version',
    scenario: 'Initial scenario',
    steps: 'Initial steps',
    expected: 'Initial expectation',
    result: 'Pending',
    actual: '',
    remarks: '',
    attributes: [],
    uploads: [],
    id: Date.now().toString() // Ensure unique ID
  });
}

  private generateTestCaseId(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Helper method to get test cases by module and version
  getTestCasesByModuleAndVersion(moduleId: string, version: string): TestCase[] {
    return this.testCases().filter(tc => 
      tc.moduleId === moduleId && tc.version === version
    ).sort((a, b) => a.slNo - b.slNo);
  }

  // Helper method to get the next available SL number for a module
  getNextSlNoForModule(moduleId: string): number {
    const moduleCases = this.testCases().filter(tc => tc.moduleId === moduleId);
    return moduleCases.length > 0 
      ? Math.max(...moduleCases.map(tc => tc.slNo)) + 1
      : 1;
  }
}