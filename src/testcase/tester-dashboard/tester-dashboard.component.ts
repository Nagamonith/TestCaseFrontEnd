import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tester-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tester-dashboard.component.html',
  styleUrls: ['./tester-dashboard.component.css']
})
export class TesterDashboardComponent {
  productName = localStorage.getItem('productName') || 'Untitled Product';
}
