

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




// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { LaptopService } from '../../../app/services/laptop.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-add-laptop',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './add-laptop.component.html',
//   styleUrls: ['./add-laptop.component.css']
// })
// export class AddLaptopComponent {
//   laptopForm: FormGroup;
//   defaultFields: string[] = [
//     'assetTag', 'employeeId', 'empName', 'make', 'model', 'cpu', 'os', 'ram', 'hdd', 'ssd', 'mouse',
//     'company', 'phone', 'email', 'comments', 'invoiceDate', 'physicalIPAddress', 'hostName', 'otherItems'
//   ];
//   extraFields: { name: string, type: 'string' | 'number' }[] = [];

//   // Move this property here, outside of any method or constructor:
//   fieldLabels: { [key: string]: string } = {
//     assetTag: 'Asset Tag',
//     employeeId: 'Employee ID',
//     empName: 'Employee Name',
//     make: 'Make',
//     model: 'Model',
//     cpu: 'CPU',
//     os: 'Operating System',
//     ram: 'RAM',
//     hdd: 'HDD',
//     ssd: 'SSD',
//     mouse: 'Mouse',
//     company: 'Company',
//     phone: 'Phone',
//     email: 'Email',
//     comments: 'Comments',
//     invoiceDate: 'Invoice Date',
//     physicalIPAddress: 'Physical IP Address',
//     hostName: 'Host Name',
//     otherItems: 'Other Items'
//     // Extra fields will use their key as label
//   };



//   constructor(
//     private fb: FormBuilder,
//     private laptopService: LaptopService,
//     private router: Router
//   ) {
//     this.laptopForm = this.fb.group({
//       assetTag: ['', Validators.required],
//       employeeId: ['', Validators.required],
//       empName: [''],
//       make: [''],
//       model: [''],
//       cpu: [''],
//       os: [''],
//       ram: [''],
//       hdd: [''],
//       ssd: [''],
//       mouse: [''],
//       company: [''],
//       phone: ['', [Validators.pattern(/^\d{10}$/)]],
//       email: ['', [Validators.email]],
//       comments: [''],
//       invoiceDate: [''],
//       physicalIPAddress: [''],
//       hostName: [''],
//       otherItems: ['']
//     });
//   }

//   addColumn(fieldName: string, fieldType: 'string' | 'number') {
//     if (!fieldName || this.laptopForm.contains(fieldName)) {
//       alert('Invalid or duplicate field name');
//       return;
//     }
//     this.laptopForm.addControl(fieldName, new FormControl('', fieldType === 'number' ? [] : []));
//     this.extraFields.push({ name: fieldName, type: fieldType });
//   }

//   getInputType(fieldKey: string): string {
//   const extra = this.extraFields.find(f => f.name === fieldKey);
//   return extra && extra.type === 'number' ? 'number' : 'text';
// }

// onAddColumn(fieldName: string, fieldType: string) {
//   if (fieldType !== 'string' && fieldType !== 'number') {
//     alert('Invalid field type');
//     return;
//   }
//   this.addColumn(fieldName, fieldType as 'string' | 'number');
// }

// deleteColumn(fieldName: string) {
//   // Remove from extraFields if present
//   this.extraFields = this.extraFields.filter(f => f.name !== fieldName);
//   // Remove from defaultFields if present (optional, for UI logic)
//   this.defaultFields = this.defaultFields.filter(f => f !== fieldName);
//   // Remove the control from the form
//   this.laptopForm.removeControl(fieldName);
// }
  

// //   onSubmit(): void {
// //   if (this.laptopForm.valid) {
// //     const newLaptop = {
// //       id: 0, // Let backend generate ID
// //       deviceDetails: this.laptopForm.value // Only current fields
// //     };

// //     this.laptopService.addLaptop(newLaptop).subscribe({
// //       next: () => {
// //         const confirmed = window.confirm('Laptop added successfully! Go back to dashboard?');
// //         if (confirmed) {
// //           this.router.navigate(['assets/dashboard']);
// //         }
// //       },
// //       error: (err) => {
// //         alert('Error adding laptop: ' + err.message);
// //       }
// //     });
// //   } else {
// //     alert('Please fill all required fields.');
// //   }
// // }


// onSubmit(): void {
//   if (this.laptopForm.valid) {
//     // Ensure all DeviceDetails fields are present
//     const deviceDetails: any = { ...this.laptopForm.value };
//     const allFields = [
//       ...this.defaultFields,
//       ...this.extraFields.map(f => f.name)
//     ];
//    for (const key of this.defaultFields) {
//   if (!(key in deviceDetails)) {
//     deviceDetails[key] = typeof this.laptopForm.get(key)?.value === 'number' ? 0 : '';
//   }
// }


//     const newLaptop = {
//       id: 0, // Let backend generate ID
//       deviceDetails
//     };

//     this.laptopService.addLaptop(newLaptop).subscribe({
//       next: () => {
//         const confirmed = window.confirm('Laptop added successfully! Go back to dashboard?');
//         if (confirmed) {
//           this.router.navigate(['assets/dashboard']);
//         }
//       },
//       error: (err) => {
//         alert('Error adding laptop: ' + err.message);
//       }
//     });
//   } else {
//     alert('Please fill all required fields.');
//   }
// }


//   goToDashboard() {
//     this.router.navigate(['assets/dashboard']);
//   }
// }