import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-excel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent {
  fileName = '';
  sheetNames = signal<string[]>([]);
  sheetData = signal<Record<string, any[]> | null>(null); // store all sheet data internally

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

      // Save only sheet names to show in UI
      this.sheetNames.set(workbook.SheetNames);

      // Keep actual sheet data internally (simulate storing to DB)
      this.sheetData.set(allSheets);
    };

    reader.readAsBinaryString(file);
  }

  saveData() {
    alert('Dummy save done. Check console.');
    console.log('📦 Final sheet data (to be sent to backend):', this.sheetData());
  }
}
