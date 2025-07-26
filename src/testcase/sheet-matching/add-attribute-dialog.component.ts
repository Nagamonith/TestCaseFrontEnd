import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-attribute-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-container">
      <h2>Add Custom Attribute</h2>
      <div class="input-container">
        <label>Attribute Name</label>
        <input 
          [(ngModel)]="attributeName" 
          [class.error]="error"
          (focus)="error = ''"
          placeholder="Enter attribute name"
        />
        <p *ngIf="error" class="error-message">{{ error }}</p>
      </div>
      <div class="button-container">
        <button (click)="dialogRef.close()" class="cancel-btn">
          Cancel
        </button>
        <button (click)="save()" class="save-btn">
          Save
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 400px;
      animation: fadeInScale 0.3s ease-out forwards;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1a365d;
    }

    .input-container {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
      color: #4a5568;
    }

    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.25rem;
      transition: all 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #3182ce;
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
    }

    input.error {
      border-color: #e53e3e;
    }

    .error-message {
      color: #e53e3e;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }

    .cancel-btn {
      background-color: #edf2f7;
    }

    .cancel-btn:hover {
      background-color: #e2e8f0;
    }

    .save-btn {
      background-color: #3182ce;
      color: white;
    }

    .save-btn:hover {
      background-color: #2c5282;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
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