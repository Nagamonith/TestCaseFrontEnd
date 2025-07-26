import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-import-excel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent {
  fileName = '';
  sheetNames = signal<string[]>([]);
  sheetData = signal<Record<string, any[]> | null>(null);

  constructor(private router: Router) {}

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binary = e.target.result;
      const workbook = XLSX.read(binary, { type: 'binary' });

      const allSheets: Record<string, any[]> = {};
      workbook.SheetNames.forEach((sheet) => {
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: '' });
        allSheets[sheet] = rows;
      });

      this.sheetNames.set(workbook.SheetNames);
      this.sheetData.set(allSheets);
    };

    reader.readAsBinaryString(file);
  }

  onCancelSheet(sheetName: string) {
    const updated = this.sheetNames().filter((name) => name !== sheetName);
    this.sheetNames.set(updated);

    const updatedData = { ...this.sheetData() };
    delete updatedData[sheetName];
    this.sheetData.set(updatedData);
  }

  onSelectSheet(sheetName: string) {
    // Navigate to mapping page with sheet name
    this.router.navigate(['/mapping', sheetName]);
  }

  saveData() {
    alert('Dummy save done. Check console.');
    console.log('📦 Final sheet data (to be sent to backend):', this.sheetData());
  }
}
