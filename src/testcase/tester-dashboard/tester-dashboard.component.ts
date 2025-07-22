import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tester-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tester-dashboard.component.html',
  styleUrls: ['./tester-dashboard.component.css'],
})
export class TesterDashboardComponent {
  products = [
    { id: '2', name: 'Qualis SPC' },
    { id: '3', name: 'MSA' },
    { id: '4', name: 'FMEA' },
    { id: '5', name: 'Wizard' },
    { id: '6', name: 'APQP' },
  ];

  expandedProductId: string | null = null;
  expandedResultsProductId: string | null = null;
  sidebarOpen = true;
  currentProductName: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if (params['productName']) {
        this.currentProductName = params['productName'];
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProduct(productId: string) {
    this.expandedProductId =
      this.expandedProductId === productId ? null : productId;
    this.expandedResultsProductId = null; // close sub-submenu when toggling product
  }

  toggleResults(productId: string) {
    this.expandedResultsProductId =
      this.expandedResultsProductId === productId ? null : productId;
  }

  onAutomationClick() {
    alert('Automation Results feature coming soon!');
  }
}
