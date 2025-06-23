import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

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

  requiredFieldsMap: { [type: string]: string[] } = {
    'Server': ['Brand', 'Model', 'Serial Number'],
    'Laptop': ['Brand', 'Model', 'Serial Number', 'RAM', 'Processor'],
    'Charger': ['Brand', 'Power'],
    'Keyboard': ['Brand', 'Type'],
    'Mouse': ['Brand', 'Type'],
    'Pendrive': ['Brand', 'Capacity'],
    'Software License': ['Software Name', 'License Key', 'Expiry Date'],
    'Chair': ['Type', 'Color'],
    'AC': ['Brand', 'Capacity'],
    'Refrigerator': ['Brand', 'Capacity'],
    'Monitor': ['Brand', 'Size'],
    'Other': []
  };

  employeeIdField: string = '';
  assetTypes: string[] = [];
  selectedAssetType: string = '';
  assetSummaries: AssetSummary[] = [];
  apiBaseUrl = JSON.parse(sessionStorage.getItem('config') || '{}').url;

  // For adding new asset type
  showAddTypeModal = false;
  newAssetType = '';

  // For dynamic fields
  showAddAssetModal = false;
  dynamicFields: { key: string, value: string }[] = [];
  newFieldName = '';
  searchEmployeeId: string = '';
  filteredAssets: any[] = [];
  showSearchModal = false;
  isLoading = false;
  searchError = '';
  assetIdField: string = '';
  activeTab: string = 'add';
  

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchAssetTypes();
    this.fetchAssetSummaries();
  }

  fetchAssetTypes() {
    this.http.get<string[]>(`${this.apiBaseUrl}/api/assets/types`)
      .subscribe(types => {
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

  exportOverallReport() {
    window.open(`${this.apiBaseUrl}/api/assets/export-all`, '_blank');
  }

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

  openAddAssetModal() {
    this.showAddAssetModal = true;
    this.dynamicFields = [];
    this.newFieldName = '';
    this.employeeIdField = '';
    this.assetIdField = '';
    const required = this.requiredFieldsMap[this.selectedAssetType] || [];
    this.dynamicFields = required.map(key => ({ key, value: '' }));
  }

  saveAsset() {
    if (!this.assetIdField || !this.assetIdField.trim()) {
      alert('AssetId is required.');
      return;
    }
    const assetData: any = {};
    this.dynamicFields.forEach(f => assetData[f.key] = f.value);
    assetData.EmployeeId = this.employeeIdField;
    assetData.AssetId = this.assetIdField;
    const payload = {
      type: this.selectedAssetType,
      data: JSON.stringify(assetData),
      employeeId: this.employeeIdField,
      assetId: this.assetIdField
    };
    this.http.post(`${this.apiBaseUrl}/api/assets`, payload)
      .subscribe({
        next: () => {
          this.showAddAssetModal = false;
          this.fetchAssetSummaries();
        },
        error: (err) => {
          alert(err.error || 'Failed to add asset.');
        }
      });
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

  goToAssetDashboardWithType(type: string) {
    this.router.navigate(['/assets/asset-dashboard'], { queryParams: { type } });
  }

  get totalAssetCount(): number {
    return this.assetSummaries.reduce((sum, summary) => sum + summary.count, 0);
  }

  goToVendorDashboard() {
    window.location.href = '/assets/vendor-dashboard';
  }

  goToEmployeeDashboard() {
    window.location.href = '/assets/employee-dashboard';
  }

  goToAssetDashboard() {
    this.router.navigate(['/assets/asset-dashboard']);
  }

  goToMainDashboard() {
    this.router.navigate(['/assets/dashboard']);
  } 
  searchEmployeeAssets(employeeId: string) {
    if (!employeeId || !employeeId.trim()) {
      this.filteredAssets = [];
      this.showSearchModal = false;
      return;
    }
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiBaseUrl}/api/assets/by-employee/${employeeId.trim()}`)
      .subscribe({
        next: data => {
          this.filteredAssets = data.map(a => ({ ...JSON.parse(a.data), Type: a.type, Id: a.id }));
          this.showSearchModal = true;
          this.isLoading = false;
        },
        error: err => {
          this.filteredAssets = [];
          this.showSearchModal = true;
          this.isLoading = false;
          this.searchError = 'Failed to fetch assets. Please try again.';
        }
      });
  }

  closeSearchModal() {
    this.showSearchModal = false;
    this.searchEmployeeId = '';
  }
  // ...existing code...
getDisplayKeys(asset: any): string[] {
  if (!asset) return [];
  return Object.keys(asset);
}
getAssetKeys(asset: any): string[] {
  return asset ? Object.keys(asset) : [];
}
}