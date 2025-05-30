
import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface DeviceDetails {
  manufacturerName: string;
  processor: string;
  installedRAM: string;
  deviceID: string;
  productID: string;
  systemType: string;
  penAndTouch: string;
  edition: string;
  version: string;
  installedOn: string;
  osBuild: string;
  
 employeeId: string;
  // experience: string;
  assignedTo: string;
  assetTag: Int32List;
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
}

