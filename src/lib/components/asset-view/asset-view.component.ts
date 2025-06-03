// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// interface DeviceDetails {
//   assetTag: number;
//   employeeId: number;
//   empName: string;
//   make: string;
//   model: string;
//   cpu: string;
//   os: string;
//   ram: string;
//   hdd: string;
//   ssd: string;
//   mouse: string;
//   company: string;
//   phone: string;
//   email: string;
//   comments: string;
//   invoiceDate: string;
//   physicalIPAddress: string;
//   hostName: string;
//   otherItems: string;
// }

// interface LaptopDto {
//   id: number;
//   deviceDetails: DeviceDetails;
// }

// @Component({
//   selector: 'app-asset-view',
//   templateUrl: './asset-view.component.html',
//   styleUrls: ['./asset-view.component.css']
// })
// export class AssetViewComponent implements OnInit {
//   asset: LaptopDto | null = null;
//   assetTag: string | null = null;
//   loading = true;

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.assetTag = this.route.snapshot.paramMap.get('assetTag');
//     if (this.assetTag) {
//       this.http.get<LaptopDto>(`https://localhost:7116/api/Device/GetLaptopByAssetTag/${this.assetTag}`)
//         .subscribe({
//           next: data => {
//             this.asset = data;
//             this.loading = false;
//           },
//           error: () => {
//             this.loading = false;
//             alert('Asset not found');
//             this.router.navigate(['/dashboard']);
//           }
//         });
//     }
//   }

//   backToDashboard() {
//     this.router.navigate(['/dashboard']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // <-- Import this

interface DeviceDetails {
  assetTag: number;
  employeeId: number;
  empName: string;
  make: string;
  model: string;
  cpu: string;
  os: string;
  ram: string;
  hdd: string;
  ssd: string;
  // mouse: string;
  company: string;
  phone: string;
  email: string;
  // comments: string;
  // invoiceDate: string;
  // physicalIPAddress: string;
  // hostName: string;
  // otherItems: string;
}

interface LaptopDto {
  id: number;
  deviceDetails: DeviceDetails;
}

@Component({
  selector: 'app-asset-view',
  standalone: true,
  imports: [CommonModule], // <-- Add this
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.css']
})
export class AssetViewComponent implements OnInit {
  asset: LaptopDto | null = null;
  assetTag: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assetTag = this.route.snapshot.paramMap.get('assetTag');
    if (this.assetTag) {
      this.http.get<LaptopDto>(`https://localhost:7116/api/Device/GetLaptopByAssetTag/${this.assetTag}`)
        .subscribe({
          next: data => {
            this.asset = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            alert('Asset not found');
            this.router.navigate(['/dashboard']);
          }
        });
    }
  }

  goToLogin() {
  this.router.navigate(['/login']);  }
}
