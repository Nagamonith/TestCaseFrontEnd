import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, RequiredValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LaptopService } from '../../../app/services/laptop.service';

@Component({
  selector: 'app-edit-laptop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-laptop.component.html',
  styleUrls: ['./edit-laptop.component.css']
})
export class EditLaptopComponent implements OnInit {
  laptopForm: FormGroup;
  laptopId!: number;
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
  employeeId: 'Employee ID',
  assignedTo: 'Assigned To'
};


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private laptopService: LaptopService
  ) {
    this.laptopForm = this.fb.group({
      manufacturerName: ['', Validators.required],
      processor: ['', Validators.required],
      installedRAM: ['', Validators.required],
      deviceID: ['', Validators.required],
      productID: ['', Validators.required],
      systemType: [''],
      penAndTouch: [''],
      edition: [''],
      version: [''],
      installedOn: [''],
      osBuild: [''],

      // experience: [''],
      employeeId: [''],
      assignedTo: ['']
    });
  }

  ngOnInit(): void {
    this.laptopId = +this.route.snapshot.paramMap.get('id')!;
    this.laptopService.getLaptopById(this.laptopId).subscribe(data => {
      this.laptopForm.patchValue(data.deviceDetails);
    });
  }

  onSubmit(): void {
    if (this.laptopForm.valid) {
      const updatedLaptop = {
        id: this.laptopId,
        deviceDetails: this.laptopForm.value
      };
      this.laptopService.updateLaptop(updatedLaptop).subscribe(() => {
        alert('Laptop updated successfully!');
        this.router.navigate(['/dashboard']);
      });
    }
  }
goToDashboard() {
  this.router.navigate(['/dashboard']);  }
}
