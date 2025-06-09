
import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef, HostListener, ViewChild } from '@angular/core';



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
   date: string;
  commentor: string;
  comment: string;
}


interface LaptopDto {
  id: number;
  deviceDetails: DeviceDetails;
}
// ...existing imports...
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
  allLaptops: LaptopDto[] = []; // To keep the unfiltered list
  laptopService: any;
  showHistoryModal = false;
  historyLaptop: LaptopDto | null = null;
  historyData: LaptopHistory[] = [];
  historyLoading = false;
  historyError = '';
  searchExpanded = false;
  searchEmployeeId: string = '';

  selectedLaptop: LaptopDto | null = null;

  constructor(private router: Router, private http: HttpClient) {}
  
  logoPath = 'assets/logo.png';
  ngOnInit() {
    const savedView = localStorage.getItem('dashboardViewMode');
    if (savedView === 'table') {
      this.isCardView = false;
    } else if (savedView === 'card') {
      this.isCardView = true;
    }
    this.loadLaptops();
  }
  setCardView(isCard: boolean) {
    this.isCardView = isCard;
    localStorage.setItem('dashboardViewMode', isCard ? 'card' : 'table');
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
    this.router.navigate(['assets/add-laptop']);
  }
   
  editLaptop(id: number) {
    this.router.navigate(['assets/edit-laptop', id]); 
  }

  deleteLaptop(id: number) {
    this.router.navigate(['assets/delete-laptop', id]);
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

  openHistory(laptop: LaptopDto) {
  this.historyLaptop = laptop;
  this.showHistoryModal = true;
  this.historyLoading = true;
  this.historyError = '';
  this.http.get<LaptopHistory[]>(`https://localhost:7116/api/Device/GetComments/${laptop.id}`)
    .subscribe({
      next: data => {
        this.historyData = data;
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

onSearch(event: Event) {
  event.preventDefault();
  const id = this.searchEmployeeId.trim().toLowerCase();
  if (id) {
    this.laptops = this.allLaptops.filter(l =>
      l.deviceDetails.employeeId.toString().toLowerCase().includes(id)
    );
  } else {
    this.laptops = this.allLaptops;
  }
}

  clearSearch() {
    this.searchEmployeeId = '';
    this.laptops = this.allLaptops;
    this.searchExpanded = false;
  }
  // --- END UPDATED SEARCH LOGIC ---

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  toggleSearch() {
    this.searchExpanded = !this.searchExpanded;
    // setTimeout(() => {
    //   if (this.searchExpanded) {
    //     const input = document.querySelector('.search-form-animated input') as HTMLInputElement;
    //     if (input) input.focus();
    //   }
    // });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.searchExpanded &&
      this.searchContainer &&
      !this.searchContainer.nativeElement.contains(event.target)
    ) {
      this.searchExpanded = false;
    }
  }
}