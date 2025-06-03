
import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';




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

interface LaptopDto {
  id: number;
  deviceDetails: DeviceDetails;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
 
})
export class LaptopDashboardComponent implements OnInit {
  isCardView = true;
  laptops: LaptopDto[] = [];
  laptopService: any;

  selectedLaptop: LaptopDto | null = null;

  constructor(private router: Router, private http: HttpClient) {}
  
   logoPath = 'assets/logo.png';
  ngOnInit() {
    this.loadLaptops();
  }

  loadLaptops() {
    this.http.get<LaptopDto[]>('https://localhost:7116/api/Device/GetAllLaptopDetails')
      .subscribe({
        next: (data) => this.laptops = data,
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
  // ...existing code...

// showHistoryModal = false;
// historyLaptop: LaptopDto | null = null;
// historyData: { date: string, action: string }[] = [];

// openHistory(laptop: LaptopDto) {
//   this.historyLaptop = laptop;
//   this.showHistoryModal = true;
//   // Replace this with your actual API call to fetch history
//   this.historyData = [
//     { date: '2024-06-01', action: 'Assigned' },
//     { date: '2024-06-10', action: 'Repaired' },
//     { date: '2024-06-15', action: 'Returned' }
//   ];
// }
// // openHistory(laptop: LaptopDto) {
// //   this.historyLaptop = laptop;
// //   this.showHistoryModal = true;
// //   this.http.get<{ date: string, action: string }[]>(`https://localhost:7116/api/LaptopHistory/GetByLaptopId/${laptop.id}`)
// //     .subscribe({
// //       next: data => this.historyData = data,
// //       error: () => this.historyData = []
// //     });
// // }


// closeHistory() {
//   this.showHistoryModal = false;
//   this.historyLaptop = null;
//   this.historyData = [];
// }
}

