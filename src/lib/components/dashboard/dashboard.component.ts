
import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




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
  mouse: string;
  company: string;
  phone: string;
  email: string;
  comments: string;
  invoiceDate: string;
  physicalIPAddress: string;
  hostName: string;
  otherItems: string;
}

interface LaptopHistory {
  action: string;
  changeDate: string;
  deviceJson: string;
  parsedDevice?: any; 
  changedFields?: { [key: string]: { oldValue: any, newValue: any } };
}


interface LaptopDto {
  id: number;
  deviceDetails: DeviceDetails;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
 
})
export class LaptopDashboardComponent implements OnInit {
  isCardView = true;
  laptops: LaptopDto[] = [];
  laptopService: any;
   showHistoryModal = false;
  historyLaptop: LaptopDto | null = null;
  historyData: LaptopHistory[] = [];
  historyLoading = false;
  historyError = '';

  selectedLaptop: LaptopDto | null = null;

  constructor(private router: Router, private http: HttpClient) {}
  
   logoPath = 'assets/logo.png';
  ngOnInit() {
    this.loadLaptops();
  }


  loadLaptops() {
  this.http.get<LaptopDto[]>('https://localhost:7116/api/Device/GetAllLaptopDetails')
    .subscribe({
      next: (data) => {
        this.laptops = data;
        this.allLaptops = data; // Save original list
      },
      error: (err) => alert('Error loading laptops: ' + err.message)
    });
}

  addLaptop() {
    this.router.navigate(['/add-laptop']);
  }
   
  editLaptop(id: number) {
    this.router.navigate(['/edit-laptop', id]); 
  }

  deleteLaptop(id: number) {
    this.router.navigate(['/delete-laptop', id]);
  }

  logout() {
    const confirmed = window.confirm('Are you sure you want to log out?');

    if (confirmed) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  openModal(laptop: LaptopDto) {
    this.selectedLaptop = laptop;
  }

  closeModal() {
    this.selectedLaptop = null;
  }
 
//  openHistory(laptop: LaptopDto) {
//     this.historyLaptop = laptop;
//     this.showHistoryModal = true;
//     this.historyLoading = true;
//     this.historyError = '';
//     this.http.get<LaptopHistory[]>(`https://localhost:7116/api/Device/GetLaptopHistory/${laptop.id}`)
//       .subscribe({
//         next: data => {
//           this.historyData = data;
//           this.historyLoading = false;
//         },
//         error: err => {
//           this.historyError = 'Failed to load history.';
//           this.historyLoading = false;
//         }
//       });
//   }
openHistory(laptop: LaptopDto) {
  this.historyLaptop = laptop;
  this.showHistoryModal = true;
  this.historyLoading = true;
  this.historyError = '';
  this.http.get<LaptopHistory[]>(`https://localhost:7116/api/Device/GetLaptopHistory/${laptop.id}`)
    .subscribe({
      next: data => {
        // Parse deviceJson for each history entry
        const parsedHistory = data.map(h => ({
          ...h,
          parsedDevice: h.deviceJson ? JSON.parse(h.deviceJson) : {}
        }));

        // Compute changed fields
        for (let i = 0; i < parsedHistory.length; i++) {
          const current = parsedHistory[i].parsedDevice || {};
          const prev = i > 0 ? parsedHistory[i - 1].parsedDevice || {} : {};
          const changed: { [key: string]: { oldValue: any, newValue: any } } = {};
          for (const key of Object.keys(current)) {
            if (current[key] !== prev[key]) {
              changed[key] = { oldValue: prev[key], newValue: current[key] };
            }
          }
          parsedHistory[i].changedFields = changed;
        }

        this.historyData = parsedHistory;
        this.historyLoading = false;
      },
      error: err => {
        this.historyError = 'Failed to load history.';
        this.historyLoading = false;
      }
    });
}
getObjectKeys(obj: any): string[] {
  return obj ? Object.keys(obj) : [];
}

  closeHistory() {
    this.showHistoryModal = false;
    this.historyLaptop = null;
    this.historyData = [];
    this.historyError = '';
  }
  
  // ...existing code...
searchEmployeeId: string = '';
allLaptops: LaptopDto[] = []; // To keep the unfiltered list





onSearch(event: Event) {
  event.preventDefault();
  const id = this.searchEmployeeId.trim();
  if (id) {
    this.laptops = this.allLaptops.filter(l => l.deviceDetails.employeeId.toString().includes(id));
  }
}

clearSearch() {
  this.searchEmployeeId = '';
  this.laptops = this.allLaptops;
}
// ...existing code...
}

