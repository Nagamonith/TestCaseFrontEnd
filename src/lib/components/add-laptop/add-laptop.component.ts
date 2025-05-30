

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
  manufacturerName: 'Manufacturer Name',
  processor: 'Processor',
  installedRAM: 'Installed RAM',
  deviceID: 'Device ID',
  productID: 'Product ID',
  systemType: 'System Type',
  penAndTouch: 'Pen & Touch',
  edition: 'Windows Edition',
  version: 'Version',
  installedOn: 'Installed On',
  osBuild: 'OS Build',

  // experience: 'Experience',
  employeeID: 'Employee ID',
  assignedTo: 'Assigned To'};

  constructor(
    private fb: FormBuilder,
    private laptopService: LaptopService,
    private router: Router
  ) {
    this.laptopForm = this.fb.group({
      manufacturerName: ['', Validators.required],
      Processor: ['', Validators.required],
      installedRAM: ['', Validators.required],
      deviceID: ['', Validators.required],
      productID: ['', Validators.required],
      systemType: ['', Validators.required],
      penAndTouch: [''],
      edition: [''],
      version: [''],
      installedOn: [''],
      osBuild: [''],

      // experience: [''],
       employeeID:[''],
      assignedTo: ['']
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
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          alert('Error adding laptop: ' + err.message);
        }
      });
    }
  }
  goToDashboard() {
  this.router.navigate(['/dashboard']);  }
}
