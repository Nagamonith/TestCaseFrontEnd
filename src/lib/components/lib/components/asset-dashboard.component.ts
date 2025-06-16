import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-asset-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css']
   
 
})
export class AssetDashboardComponent implements OnInit {
  apiBaseUrl = 'https://localhost:7116';
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
  selectedType = '';
  assets: any[] = [];
  columns: string[] = [];
  // ...rest of your code...

  constructor(private http: HttpClient) {}

  // ngOnInit() {
  //   this.http.get<string[]>(`${this.apiBaseUrl}/api/assets/types`)
  //     .subscribe(types => this.assetTypes = types);
  // }
  ngOnInit() {
  this.http.get<string[]>(`${this.apiBaseUrl}/api/assets/types`)
    .subscribe(types => {
      const allTypes = [...this.essentialAssetTypes, ...types];
      this.assetTypes = Array.from(new Set(allTypes));
    });
}

  fetchAssets() {
    if (!this.selectedType) return;
    this.http.get<any[]>(`${this.apiBaseUrl}/api/assets?type=${this.selectedType}`)
      .subscribe(data => {
        this.assets = data.map(a => ({ ...JSON.parse(a.data), Id: a.id, CreatedAt: a.createdAt }));
        this.columns = this.assets.length ? Object.keys(this.assets[0]) : [];
      });
  }
  
}