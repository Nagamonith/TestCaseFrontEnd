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
  sheetData = signal<Record<string, any[]> | null>(null); // key: sheet name, value: JSON rows

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

      this.sheetData.set(allSheets);
    };

    reader.readAsBinaryString(file);
  }

  saveData() {
    alert('✅ Dummy save done. Check console.');
    console.log('📄 Final imported test case data:', this.sheetData());
  }
}
