// src/app/tester/sheet-matching/add-attribute-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-attribute-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-xl font-bold mb-4">Add Custom Attribute</h2>
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Attribute Name</label>
      <input 
        [(ngModel)]="attributeName" 
        class="w-full px-3 py-2 border rounded"
        placeholder="Enter attribute name"
      />
      <p *ngIf="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </div>
    <div class="flex justify-end space-x-2">
      <button 
        (click)="dialogRef.close()"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
      <button 
        (click)="save()"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  `
})
export class AddAttributeDialogComponent {
  attributeName = '';
  error = '';

  constructor(
    public dialogRef: MatDialogRef<AddAttributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { existingAttributes: string[] }
  ) {}

  save() {
    if (!this.attributeName.trim()) {
      this.error = 'Attribute name is required';
      return;
    }

    if (this.data.existingAttributes.includes(this.attributeName)) {
      this.error = 'This attribute already exists';
      return;
    }

    this.dialogRef.close(this.attributeName);
  }
}