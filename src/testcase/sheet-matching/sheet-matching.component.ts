import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAttributeDialogComponent } from './add-attribute-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestCaseService } from 'src/app/shared/services/test-case.service';

interface FieldMapping {
  required: boolean;
  field: string;
  label: string;
  mappedTo: string;
  example?: string;
}

@Component({
  selector: 'app-sheet-matching',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    DragDropModule,
    MatDialogModule
  ],
  templateUrl: './sheet-matching.component.html',
  styleUrls: ['./sheet-matching.component.css']
})
export class SheetMatchingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private testCaseService = inject(TestCaseService);

  sheetName = signal<string>('');
  sheetColumns = signal<string[]>([]);
  sheetData = signal<any[]>([]);
  customAttributes = signal<string[]>([]);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Track mappings for custom attributes separately
  attributeMappings = signal<Record<string, string>>({});

  coreFields = signal<FieldMapping[]>([
    { required: true, field: 'slNo', label: 'Serial No', mappedTo: '', example: '1, 2, 3' },
    { required: true, field: 'testCaseId', label: 'Test Case ID', mappedTo: '', example: 'TC-001' },
    { required: true, field: 'moduleId', label: 'Module ID', mappedTo: '', example: 'MOD-001' },
    { required: true, field: 'scenario', label: 'Scenario', mappedTo: '', example: 'User login validation' },
    { required: true, field: 'steps', label: 'Steps', mappedTo: '', example: '1. Enter username\n2. Enter password' },
    { required: true, field: 'expected', label: 'Expected Result', mappedTo: '', example: 'User should be logged in' },
    { required: false, field: 'version', label: 'Version', mappedTo: '', example: '1.0' },
    { required: false, field: 'useCase', label: 'Use Case', mappedTo: '', example: 'UC-001' },
    { required: false, field: 'result', label: 'Result', mappedTo: '', example: 'Pass/Fail' },
    { required: false, field: 'actual', label: 'Actual Result', mappedTo: '', example: 'User logged in successfully' },
    { required: false, field: 'remarks', label: 'Remarks', mappedTo: '', example: 'Tested on Chrome' },
    { required: false, field: 'uploads', label: 'Attachments', mappedTo: '', example: 'screenshot.png' }
  ]);

  allFields = computed(() => [
    ...this.coreFields(),
    ...this.customAttributes().map(attr => ({
      required: false,
      field: `attr_${attr}`,
      label: attr,
      mappedTo: this.attributeMappings()[attr] || '',
      example: ''
    }))
  ]);

  previewData = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sheetName = params.get('sheetName');
      if (!sheetName) {
        this.router.navigate(['/tester/import-excel']);
        return;
      }

      this.sheetName.set(sheetName);

      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras?.state || window.history.state;

      if (state?.sheetColumns && state?.sheetData) {
        this.processSheetData(state.sheetColumns, state.sheetData, sheetName);
      } else {
        this.loadFromSessionStorage(sheetName);
      }
    });
  }

  private processSheetData(columns: string[], data: any[], sheetName: string) {
    this.sheetColumns.set(columns);
    this.sheetData.set(data);
    this.autoMapFields();
    this.generatePreview();
    
    sessionStorage.setItem('sheetMappingData', JSON.stringify({
      sheetName,
      sheetColumns: columns,
      sheetData: data
    }));
  }

  private loadFromSessionStorage(sheetName: string) {
    const savedData = sessionStorage.getItem('sheetMappingData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.sheetName === sheetName) {
          this.processSheetData(
            parsedData.sheetColumns, 
            parsedData.sheetData, 
            sheetName
          );
          return;
        }
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    this.router.navigate(['/tester/import-excel'], {
      queryParams: { missingData: true }
    });
  }

  autoMapFields() {
    const sheetCols = this.sheetColumns();
    const updatedFields = this.coreFields().map(field => {
      if (field.field === 'moduleId') {
        const generatedModuleId = this.generateModuleId();
        return { ...field, mappedTo: generatedModuleId || '' };
      }

      let match = sheetCols.find(col => col.toLowerCase() === field.field.toLowerCase());
      if (!match) match = sheetCols.find(col => col.toLowerCase() === field.label.toLowerCase());
      if (!match) {
        match = sheetCols.find(col => 
          col.toLowerCase().includes(field.field.toLowerCase()) || 
          col.toLowerCase().includes(field.label.toLowerCase())
        );
      }
      return { ...field, mappedTo: match || '' };
    });

    this.coreFields.set(updatedFields);
  }

  private generateModuleId(): string | null {
    const sheetName = this.sheetName().toLowerCase();
    const sheetCols = this.sheetColumns();
    
    const moduleNameMatch = sheetName.match(/(\w+)(module|mod|m)?$/i);
    if (moduleNameMatch) {
      const moduleName = moduleNameMatch[1]
        .replace(/[^a-zA-Z]/g, ' ')
        .trim()
        .replace(/\s+/g, '-')
        .toUpperCase();
      return `MOD-${moduleName}`;
    }
    
    const moduleCols = sheetCols.filter(col => 
      col.toLowerCase().includes('module') || 
      col.toLowerCase().includes('mod') ||
      col.toLowerCase().includes('component')
    );
    
    if (moduleCols.length > 0 && this.sheetData().length > 0) {
      const sampleValue = this.sheetData()[0][moduleCols[0]];
      if (sampleValue) {
        return this.formatModuleId(sampleValue);
      }
    }
    
    if (sheetName.length > 0) {
      const initials = sheetName
        .split(/[\s-_]/)
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .toUpperCase();
      return initials ? `MOD-${initials}` : null;
    }
    
    return null;
  }

  private formatModuleId(rawValue: string): string {
    let cleanValue = rawValue.toString()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .toUpperCase();
      
    if (!cleanValue.startsWith('MOD-')) {
      cleanValue = `MOD-${cleanValue}`;
    }
    
    return cleanValue.substring(0, 20);
  }
    getPreviewValue(row: any, field: string): string {
    if (field.startsWith('attr_')) {
      const attrKey = field.substring(5);
      const attribute = row.attributes?.find((a: any) => a.key === attrKey);
      return attribute?.value || '-';
    }
    return row[field] || '-';
  }

  updateMapping(field: string, selectedColumn: string) {
    this.coreFields.update(fields => 
      fields.map(f => f.field === field ? { ...f, mappedTo: selectedColumn } : f)
    );
    this.generatePreview();
  }

  updateAttributeMapping(attr: string, selectedColumn: string) {
    this.attributeMappings.update(mappings => ({
      ...mappings,
      [attr]: selectedColumn
    }));
    this.generatePreview();
  }

 generatePreview() {
    if (this.sheetData().length === 0) return;

    const preview = this.sheetData().slice(0, 3).map(row => {
      const previewRow: any = {};
      const attributes: any[] = [];

      // Process core fields
      this.coreFields().forEach(field => {
        if (field.mappedTo) {
          previewRow[field.field] = row[field.mappedTo];
        }
      });

      // Process custom attributes
      this.customAttributes().forEach(attr => {
        const column = this.attributeMappings()[attr];
        if (column) {
          attributes.push({
            key: attr,
            value: row[column]
          });
        }
      });

      if (attributes.length > 0) {
        previewRow.attributes = attributes;
      }

      return previewRow;
    });

    this.previewData.set(preview);
  }

  openAddAttributeDialog() {
    const dialogRef = this.dialog.open(AddAttributeDialogComponent, {
      width: '400px',
      data: { existingAttributes: this.customAttributes() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customAttributes.update(attrs => [...attrs, result]);
        this.generatePreview();
      }
    });
  }

  removeCustomAttribute(attr: string) {
    this.customAttributes.update(attrs => attrs.filter(a => a !== attr));
    this.attributeMappings.update(mappings => {
      const newMappings = {...mappings};
      delete newMappings[attr];
      return newMappings;
    });
    this.generatePreview();
  }

  async saveMapping() {
    this.isSaving.set(true);
    this.errorMessage.set('');
    
    // Validate required fields
    const missingRequired = this.coreFields().filter(f => 
      f.required && !f.mappedTo
    );
    
    if (missingRequired.length > 0) {
      this.errorMessage.set(
        `Please map all required fields: ${missingRequired.map(f => f.label).join(', ')}`
      );
      this.isSaving.set(false);
      return;
    }

    try {
      // Create module from sheet name
      const moduleName = this.generateModuleNameFromSheet();
      const moduleId = this.testCaseService.addModule(moduleName, 'v1.0');
      
      // Process and save all test cases
      this.sheetData().forEach(row => {
        const testCase: any = {
          moduleId,
          version: 'v1.0',
          result: 'Pending',
          actual: '',
          remarks: '',
          attributes: [],
          uploads: []
        };

        // Map core fields
        this.coreFields().forEach(field => {
          if (field.mappedTo) {
            testCase[field.field] = row[field.mappedTo];
          }
        });

        // Map custom attributes
        this.customAttributes().forEach(attr => {
          const column = this.attributeMappings()[attr];
          if (column) {
            testCase.attributes.push({
              key: attr,
              value: row[column]
            });
          }
        });

        this.testCaseService.addTestCase(testCase);
      });

      this.router.navigate(['/tester/modules', moduleId]);
    } catch (error) {
      console.error('Error saving test cases:', error);
      this.errorMessage.set('Failed to save test cases. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  private generateModuleNameFromSheet(): string {
    const sheetName = this.sheetName();
    return sheetName
      .replace(/^mod-?/i, '')
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') + ' Module';
  }

  goBack() {
    this.router.navigate(['/tester/import-excel']);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sheetColumns(), event.previousIndex, event.currentIndex);
    this.generatePreview();
  }
}