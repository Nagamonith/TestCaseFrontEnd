
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-asset-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css']
})
export class AssetDashboardComponent implements OnInit {
  apiBaseUrl = JSON.parse(sessionStorage.getItem('config') || '{}').url;
  
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
  assetTypes: string[] = [];
  selectedType = '';
  assets: any[] = [];
  columns: string[] = [];
  showEditModal = false;
  editAssetId: number | null = null;
  editFields: { key: string, value: string }[] = [];
  employees: any[] = [];
  invoiceFile: File | null = null;
  currentInvoiceFileName: string | null = null;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.http.get<string[]>(`${this.apiBaseUrl}/api/assets/types`)
      .subscribe(types => {
        const allTypes = [...this.essentialAssetTypes, ...types];
        this.assetTypes = Array.from(new Set(allTypes));
        this.route.queryParams.subscribe(params => {
          if (params['type']) {
            this.selectedType = params['type'];
            this.fetchAssets();
          }
        });
      });
    this.http.get<any[]>(`${this.apiBaseUrl}/api/assets/employees`)
      .subscribe(data => this.employees = data);
  }

  fetchAssets() {
    if (!this.selectedType) return;
    this.http.get<any[]>(`${this.apiBaseUrl}/api/assets?type=${this.selectedType}`)
      .subscribe(data => {
        this.assets = data.map(a => ({
          ...JSON.parse(a.data),
          AssetId: a.assetId,
          Id: a.id,
          CreatedAt: a.createdAt,
          EmployeeId: a.employeeId,
        }));
        const required = this.requiredFieldsMap[this.selectedType] || [];
        const extraFields = this.assets.length
          ? Object.keys(this.assets[0]).filter(
              k => !required.includes(k) && k !== 'Id' && k !== 'CreatedAt' && k !== 'EmployeeId' && k !== 'AssetId'
            )
          : [];
        this.columns = [...required, ...extraFields, 'AssetId', 'EmployeeId', 'Id', 'CreatedAt'];
      });
    if (!this.assets.length) {
      const required = this.requiredFieldsMap[this.selectedType] || [];
      this.columns = [...required, 'AssetId', 'EmployeeId', 'Id', 'CreatedAt'];
    }
  }

  openEditAsset(asset: any) {
    this.showEditModal = true;
    this.editAssetId = asset.Id;
    this.editFields = this.columns
      .filter(col => col !== 'Id' && col !== 'CreatedAt')
      .map(key => ({ key, value: asset[key] || '' }));
  }

  saveEditAsset() {
    if (this.editAssetId == null) return;
    const assetData: any = {};
    this.editFields.forEach(f => assetData[f.key] = f.value);

    // Validate AssetId
    if (!assetData.AssetId || !assetData.AssetId.trim()) {
      alert('AssetId is required.');
      return;
    }

    const payload = {
      type: this.selectedType,
      data: JSON.stringify(assetData),
      employeeId: assetData.EmployeeId,
      assetId: assetData.AssetId
    };
    this.http.put(`${this.apiBaseUrl}/api/assets/${this.editAssetId}`, payload)
      .subscribe({
        next: () => {
          this.showEditModal = false;
          this.fetchAssets();
        },
        error: (err) => {
          if (err.status === 409) {
            alert(err.error || 'AssetId must be unique.');
          } else if (err.status === 400) {
            alert(err.error || 'AssetId is required.');
          } else {
            alert('Failed to update asset.');
          }
        }
      });
  }

  deleteAsset(id: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.http.delete(`${this.apiBaseUrl}/api/assets/${id}`)
        .subscribe(() => this.fetchAssets());
    }
  }

  goToPreviousPage() {
    this.router.navigate(['/assets/pre-dashboard']);
  }
}