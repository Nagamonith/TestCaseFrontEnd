import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
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

  addProduct(newProductName: string) {
    const newId = (Math.max(...this.products.map(p => +p.id)) + 1).toString();
    const newProduct = { id: newId, name: newProductName };
    this.products.push(newProduct);
    this.productsSubject.next(this.products); // push new value
  }
}
