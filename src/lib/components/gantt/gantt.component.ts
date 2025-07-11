// import { Component, inject } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { DxGanttModule } from 'devextreme-angular';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-gantt',
//   standalone: true,
//   imports: [CommonModule, DxGanttModule, FormsModule],
//   templateUrl: './gantt.component.html',
//   styleUrls: ['./gantt.component.css']
// })
// export class GanttComponent {
//   private http = inject(HttpClient);
//   gattData:any;
//   ganttTasks: any[] = [];
//   dependencies: any[] = [];

//   // Filter inputs
//   projectName = '';
//   startDate = '';
//   endDate = '';
//   resourceName = '';
// targetVersion = '';

//   ngOnInit() {
   
//   }

//   loadData() {
//     let params = new HttpParams();
//     if (this.projectName) params = params.set('projectName', this.projectName);
//     if (this.startDate) params = params.set('startDate', this.startDate);
//     if (this.endDate) params = params.set('endDate', this.endDate);
//     if (this.resourceName) params = params.set('resourceName', this.resourceName);
//     if (this.targetVersion) params = params.set('targetVersion', this.targetVersion);

//     this.http.get<any[]>('http://localhost:5238/api/ganttchart', { params }).subscribe({
//       next: (data) => {
//       console.log('Gantt data loaded:', data);
//       this.gattData = data;
//       },
//       error: (err) => {
//         console.error('Error loading Gantt data:', err);
//       }
//     });
//   }

//   onFilterSubmit() {
//     this.loadData();
//   }
// }
import { Component, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DxGanttModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [CommonModule, DxGanttModule, FormsModule],
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent {
  private http = inject(HttpClient);
  gattData:any;
  ganttTasks: any[] = [];
  dependencies: any[] = [];

  // Filter inputs
  projectName = '';
  startDate = '';
  endDate = '';
  resourceName = '';
targetVersion = '';

  ngOnInit() {
   
  }

  loadData() {
    let params = new HttpParams();
    if (this.projectName) params = params.set('projectName', this.projectName);
    if (this.startDate) params = params.set('startDate', this.startDate);
    if (this.endDate) params = params.set('endDate', this.endDate);
    if (this.resourceName) params = params.set('resourceName', this.resourceName);
    if (this.targetVersion) params = params.set('targetVersion', this.targetVersion);

    this.http.get<any[]>('http://localhost:5238/api/ganttchart', { params }).subscribe({
      next: (data) => {
      console.log('Gantt data loaded:', data);
      this.gattData = data;
      },
      error: (err) => {
        console.error('Error loading Gantt data:', err);
      }
    });
  }

  onFilterSubmit() {
    this.loadData();
  }
}
