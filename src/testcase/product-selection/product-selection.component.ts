import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Needed for [(ngModel)]

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Include FormsModule
  templateUrl: './product-selection.component.html',
  styleUrl: './product-selection.component.css'
})
export class ProductSelectionComponent {
  products = [
    { id: '1', name: 'CopyEdit' },
    { id: '2', name: 'Qualis SPC' },
    { id: '3', name: 'MSA' },
    { id: '4', name: 'FMEA' },
    { id: '5', name: 'Wizard' },
    { id: '6', name: 'APQP' }
  ];

  newProductName = '';

  constructor(private router: Router) {}

  selectProduct(product: any) {
    localStorage.setItem('productId', product.id);
    localStorage.setItem('productName', product.name);
    this.router.navigate(['/tester']);
  }

  addProduct() {
    if (!this.newProductName.trim()) return;
    const newId = (this.products.length + 1).toString();
    this.products.push({ id: newId, name: this.newProductName });
    this.newProductName = '';
  }
}
