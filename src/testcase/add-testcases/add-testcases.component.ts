import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-testcases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-testcases.component.html',
  styleUrls: ['./add-testcases.component.css']
})
export class AddTestcasesComponent {
  private fb = inject(FormBuilder);

  /* ── Dummy modules & versions ─────────────────────────────── */
  modules = [
    { id: 'mod1', name: 'Login Module' },
    { id: 'mod2', name: 'Reports Module' }
  ];

  versionsByModule: Record<string, string[]> = {
    mod1: ['v1.0', 'v1.1'],
    mod2: ['v2.0']
  };

  /* ── Signals to track current selections ──────────────────── */
  selectedModule = signal<string | null>(null);

  /* ── Reactive Form Definition ─────────────────────────────── */
  form = this.fb.group({
    moduleId: '',
    version: '',
    fixed: this.fb.group({
      slNo: 1,
      useCase: '',
      testCaseId: '',
      scenario: '',
      steps: '',
      expected: ''
    }),
    dynamic: this.fb.array([])
  });

  /* ── Convenience getter for FormArray ─────────────────────── */
  get dynamic(): FormArray {
    return this.form.get('dynamic') as FormArray;
  }

  /* ── Add / remove custom attribute rows ───────────────────── */
  addDynamicField() {
    this.dynamic.push(
      this.fb.group({
        key: '',
        value: ''
      })
    );
  }

  removeDynamicField(index: number) {
    this.dynamic.removeAt(index);
  }

  /* ── Handle module dropdown change (type‑safe) ────────────── */
  onModuleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedModule.set(value);
    this.form.get('moduleId')?.setValue(value);
    /* Optionally reset version when module changes */
    this.form.get('version')?.setValue('');
  }

  /* ── Submit handler (dummy) ───────────────────────────────── */
  onSubmit() {
    console.log('✅ Submitted Test Case:', this.form.value);
    alert('Test case saved (dummy)! Check console.');
    this.form.reset();
    this.dynamic.clear();
  }

  /* ── Computed signal to expose available versions ─────────── */
  versions = computed(() => {
    const id = this.form.get('moduleId')?.value;
    return id ? this.versionsByModule[id] ?? [] : [];
  });
}
