import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  editing?: boolean; // Optional field for UI state
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = [
    { id: '2', name: 'Qualis SPC' },
    { id: '3', name: 'MSA' },
    { id: '4', name: 'FMEA' },
    { id: '5', name: 'Wizard' },
    { id: '6', name: 'APQP' },
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(newProductName: string): void {
    const newId = (Math.max(...this.products.map(p => +p.id)) + 1).toString();
    const newProduct = { id: newId, name: newProductName.trim() };
    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
  }

  updateProduct(updatedProduct: Product): Observable<void> {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = { ...updatedProduct };
      this.productsSubject.next([...this.products]);
    }
    return of(undefined);
  }

  deleteProduct(productId: string): Observable<void> {
    this.products = this.products.filter(p => p.id !== productId);
    this.productsSubject.next([...this.products]);
    return of(undefined);
  }
}