


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface AssetSummary {
  type: string;
  count: number;
}

@Component({
  selector: 'app-pre-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pre-dashboard.component.html',
  styleUrls: ['./pre-dashboard.component.css']
})
export class PreDashboardComponent implements OnInit {
  // Keep essential types hardcoded
  essentialAssetTypes: string[] = [
    'Server',
    'Laptop',
    'Charger',
    'Keyboard',
    'Mouse',
    'Pendrive',
    'Software License',
    'Chair',
    'AC',
    'Refrigerator',
    'Monitor',
    'Other'
  ];
  assetTypes: string[] = [];
  selectedAssetType: string = '';
  assetSummaries: AssetSummary[] = [];
  apiBaseUrl = 'https://localhost:7116'; // Update as needed

  // For adding new asset type
  showAddTypeModal = false;
  newAssetType = '';

  // For dynamic fields
  showAddAssetModal = false;
  dynamicFields: { key: string, value: string }[] = [];
  newFieldName = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAssetTypes();
    this.fetchAssetSummaries();
  }

  fetchAssetTypes() {
    this.http.get<string[]>(`${this.apiBaseUrl}/api/assets/types`)
      .subscribe(types => {
        // Combine essential and backend types, removing duplicates
        const allTypes = [...this.essentialAssetTypes, ...types];
        this.assetTypes = Array.from(new Set(allTypes));
      });
  }

  fetchAssetSummaries() {
    this.http.get<AssetSummary[]>(`${this.apiBaseUrl}/api/assets/summary`)
      .subscribe(data => this.assetSummaries = data);
  }

  onAssetTypeChange() {
    // Optionally fetch details for the selected type
  }

  exportReport() {
    window.open(`${this.apiBaseUrl}/api/assets/export?type=${this.selectedAssetType}`, '_blank');
  }

  // Add new asset type
  openAddTypeModal() {
    this.showAddTypeModal = true;
    this.newAssetType = '';
  }

  addAssetType() {
    if (this.newAssetType && !this.assetTypes.includes(this.newAssetType)) {
      this.http.post(
        `${this.apiBaseUrl}/api/assets/types`,
        `"${this.newAssetType}"`,
        { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
      ).subscribe(() => {
        this.fetchAssetTypes();
        this.showAddTypeModal = false;
      });
    }
  }

  // Add asset with dynamic fields
  openAddAssetModal() {
    this.showAddAssetModal = true;
    this.dynamicFields = [];
    this.newFieldName = '';
  }

  addField() {
    if (this.newFieldName && !this.dynamicFields.some(f => f.key === this.newFieldName)) {
      this.dynamicFields.push({ key: this.newFieldName, value: '' });
      this.newFieldName = '';
    }
  }

  removeField(idx: number) {
    this.dynamicFields.splice(idx, 1);
  }

  saveAsset() {
    const assetData: any = {};
    this.dynamicFields.forEach(f => assetData[f.key] = f.value);
    const payload = {
      type: this.selectedAssetType,
      data: JSON.stringify(assetData)
    };
    this.http.post(`${this.apiBaseUrl}/api/assets`, payload)
      .subscribe(() => {
        this.showAddAssetModal = false;
        this.fetchAssetSummaries();
      });
  }
  goToAssetDashboard() {
    window.location.href = '/assets/asset-dashboard';
  }
  // ...existing code...
get totalAssetCount(): number {
  return this.assetSummaries.reduce((sum, summary) => sum + summary.count, 0);
}
// ...existing code...
}