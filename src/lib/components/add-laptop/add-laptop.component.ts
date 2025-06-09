

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LaptopService } from '../../../app/services/laptop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-laptop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-laptop.component.html',
  styleUrls: ['./add-laptop.component.css']
})
export class AddLaptopComponent {
  laptopForm: FormGroup;
   fieldLabels: { [key: string]: string } = {
 };

  constructor(
    private fb: FormBuilder,
    private laptopService: LaptopService,
    private router: Router
  ) {
    this.laptopForm = this.fb.group({
     
      assetTag: ['', Validators.required],
  employeeId: ['', Validators.required],
  empName:  ['', Validators.required],
  make: ['', Validators.required],
  model: ['', Validators.required],
  cpu: ['', Validators.required],
  os: ['', Validators.required],
  ram: ['', Validators.required],
  hdd: ['', Validators.required],
  ssd: ['', Validators.required],
  mouse: ['', Validators.required],
  company:  ['', Validators.required],
  phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  email: ['', [Validators.required, Validators.email]],
  comments: [''],
  invoiceDate: ['', Validators.required],
  physicalIPAddress: ['', Validators.required],
  hostName: ['', Validators.required],
  otherItems: ['']
    });
  }

  onSubmit(): void {
    if (this.laptopForm.valid) {
      const newLaptop = {
        id: 0, // Let backend generate ID
        deviceDetails: this.laptopForm.value
      };

      this.laptopService.addLaptop(newLaptop).subscribe({
        next: () => {
          const confirmed = window.confirm('Laptop added successfully! Go back to dashboard?');
          if (confirmed) {
            this.router.navigate(['assets/dashboard']);
          }
        },
        error: (err) => {
          alert('Error adding laptop: ' + err.message);
        }
      });
    }
  }
  goToDashboard() {
  this.router.navigate(['assets/dashboard']);  }
}
