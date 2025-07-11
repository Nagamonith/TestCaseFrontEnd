// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { DxGanttModule } from 'devextreme-angular';
// @Component({
//   selector: 'app-gantt-editor',
//   standalone: true,
//   templateUrl: './gantt-editor.component.html',
//   styleUrls: ['./gantt-editor.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, DxGanttModule]
// })
// export class GanttEditorComponent {
//   ganttForm: FormGroup;
//   loading = false;
//   loaded = false;
//   bugNotFound = false;
//   ganttChartVisible = false;
// ganttChartData: any[] = [];
// skippedTasks: any[] = [];
// ganttChartLoading = false;

// //ADDED: Gantt chart dependencies, resources, and assignments
// ganttDependencies: any[] = [];
// ganttResources: any[] = [];
// ganttAssignments: any[] = [];


//   constructor(private fb: FormBuilder, private http: HttpClient) {
//     this.ganttForm = this.fb.group({
//       bugId: ['', Validators.required],
//       summary: [''],
//       targetVersion: [''],
//       resourceName: [''],
//       startDate: [''],
//       originalMergeDate: [''],
//       currentMergeDueDate: [''],
//       bugUrl: [''],
//       projectName: [''],
//       estimatedHours: [''],
//       actualHours: [''],
//       progress: ['']
//     });
//   }

//   loadBug() {
//     this.loading = true;
//     const bugId = this.ganttForm.value.bugId;

//     this.http.get<any>(`http://localhost:5238/api/gantt/bug/${bugId}`).subscribe({
//       next: (data) => {
//         console.log('✅ API response:', data); // <== confirm values arriving

//         this.ganttForm.patchValue({
//           summary: data.summary ?? '',
//           targetVersion: data.target_Version ?? '',
//           resourceName: data.resource_Name ?? '',
//           startDate: data.start_Date ? data.start_Date.slice(0, 10) : '',
//           originalMergeDate: data.original_Merge_Date ? data.original_Merge_Date.slice(0, 10) : '',
//           currentMergeDueDate: data.current_Merge_Due_Date ? data.current_Merge_Due_Date.slice(0, 10) : '',
//           bugUrl: data.bug_url ?? '',
//           projectName: data.project_Name ?? '',
//           estimatedHours: data.estimated_Hours ?? '',
//           actualHours: data.actual_Hours ?? '',
//           progress: data.progress ?? ''
//         });

//         this.loaded = true;
//         this.bugNotFound = false;
//         this.loading = false;
//       },
//       error: () => {
//         this.bugNotFound = true;
//         this.loaded = false;
//         this.loading = false;
//       }
//     });
//   }

//   saveTask() {
//     const emptyToNull = (value: any) => value === '' ? null : value;

//     const payload = {
//       bugID: emptyToNull(this.ganttForm.value.bugId),
//       summary: emptyToNull(this.ganttForm.value.summary),
//       target_Version: emptyToNull(this.ganttForm.value.targetVersion),
//       resource_Name: emptyToNull(this.ganttForm.value.resourceName),
//       start_Date: emptyToNull(this.ganttForm.value.startDate),
//       original_Merge_Date: emptyToNull(this.ganttForm.value.originalMergeDate),
//       current_Merge_Due_Date: emptyToNull(this.ganttForm.value.currentMergeDueDate),
//       progress: emptyToNull(this.ganttForm.value.progress),
//       estimated_Hours: emptyToNull(this.ganttForm.value.estimatedHours),
//       actual_Hours: emptyToNull(this.ganttForm.value.actualHours),
//       bug_url: emptyToNull(this.ganttForm.value.bugUrl),
//       project_Name: emptyToNull(this.ganttForm.value.projectName)
//     };

//     this.http.post('https://localhost:7116/api/gantt', payload).subscribe({
//       next: () => alert('✅ Task saved successfully!'),
//       error: (err) => {
//         console.error('❌ Save error:', err.error);
//         alert('❌ Error saving task.');
//       }
//     });
//   }
 

// showGanttChart() {
//   const projectName = this.ganttForm.value.projectName;
//   const targetVersion = this.ganttForm.value.targetVersion;
//   const resourceName = this.ganttForm.value.resourceName;

//   if (!projectName || !targetVersion) {
//     alert('Project Name and Target Version are required!');
//     return;
//   }

//   this.ganttChartLoading = true;
//   this.ganttChartVisible = true;
//   this.ganttChartData = [];
//   this.skippedTasks = [];

//   const params: any = {
//     projectName,
//     targetVersion
//   };
//   if (resourceName) params.resourceName = resourceName;

//   this.http.get<any[]>('http://localhost:5238/api/gantt/chart', { params }).subscribe({
//     next: (data) => {
//       // Exclude tasks missing start or end date
//       this.ganttChartData = data.filter(
//         t => t.start_Date && t.current_Merge_Due_Date
//       );
//       this.skippedTasks = data.filter(
//         t => !t.start_Date || !t.current_Merge_Due_Date
//       );
//       this.ganttChartLoading = false;
//     },
//     error: (err) => {
//       alert('Error loading Gantt data');
//       this.ganttChartLoading = false;
//     }
//   });
// }

// closeGanttChart() {
//   this.ganttChartVisible = false;
// }


// }

// import { ChangeDetectorRef, Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { DxGanttModule } from 'devextreme-angular';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-gantt-editor',
//   standalone: true,
//   templateUrl: './gantt-editor.component.html',
//   styleUrls: ['./gantt-editor.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, DxGanttModule]
// })
// export class GanttEditorComponent {
//   ganttForm: FormGroup;
//   ganttChartVisible = false;
//   ganttChartLoading = false;
//   ganttChartData: any[] = [];
//   skippedTasks: any[] = [];
//   ganttDependencies: any[] = [];
//   ganttResources: any[] = [];
//   ganttAssignments: any[] = [];

//   // Modal state
//   showTaskModal = false;
//   selectedTask: any = null;

//   constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
//     this.ganttForm = this.fb.group({
//       projectName: ['', Validators.required],
//       targetVersion: ['', Validators.required]
//     });
//   }

//   showGanttChart() {
//     const projectName = this.ganttForm.value.projectName;
//     const targetVersion = this.ganttForm.value.targetVersion;

//     if (!projectName || !targetVersion) {
//       alert('Project Name and Target Version are required!');
//       return;
//     }

//     this.ganttChartLoading = true;
//     this.ganttChartVisible = true;
//     this.ganttChartData = [];
//     this.skippedTasks = [];
//     this.ganttDependencies = [];
//     this.ganttResources = [];
//     this.ganttAssignments = [];

//     const params: any = {
//       projectName,
//       targetVersion
//     };

//     this.http.get<any>('http://localhost:5238/api/gantt/chart', { params }).subscribe({
//       next: (data) => {

//        this.ganttChartData = (data.tasks || []).filter(
//   (t: any) => !!t.start && !!t.end
// );
// this.ganttDependencies = data.dependencies || [];
// this.ganttResources = data.resources || [];
// this.ganttAssignments = data.assignments || [];
// this.skippedTasks = (data.tasks || []).filter(
//   (t: any) => !t.start || !t.end
// );
//         this.ganttChartLoading = false;
//       },
//       error: (err) => {
//         alert('Error loading Gantt data');
//         this.ganttChartLoading = false;
//       }
//     });
//   }

//   // Double-click row to edit
//   onRowDblClick(task: any) {
//     this.selectedTask = { ...task };
//     // Set dependency for modal editing
//     const dep = this.ganttDependencies.find(dep => dep.successorId === task.id);
//     this.selectedTask.dependency = dep ? dep.predecessorId : null;
//     this.showTaskModal = true;
//   }

//   closeTaskModal() {
//     this.showTaskModal = false;
//     this.selectedTask = null;
//   }

//   saveTaskModal() {
//     // Save logic: POST to your backend, then reload
//     // You may need to map dependency field back to your backend model
//     const payload = { ...this.selectedTask };
//     if (payload.dependency !== undefined) {
//       // If dependency is set, update the dependencies array accordingly
//       // (You may need to handle this in your backend)
//     }
//     this.http.post('http://localhost:5238/api/gantt', payload).subscribe({
//       next: () => {
//         this.closeTaskModal();
//         this.showGanttChart();
//       },
//       error: () => alert('Error saving task')
//     });
//   }

//   // Helper for displaying dependency in the grid

//   getDependency(taskId: number): number | string {
//     const dep = this.ganttDependencies.find(dep => dep.successorId === taskId);
//     return dep ? dep.predecessorId : '-';
//   }
//   getResourceName(taskId: number): string {
//   const assignment = this.ganttAssignments.find(a => a.taskId === taskId);
//   if (!assignment) return '-';
//   const resource = this.ganttResources.find(r => r.id === assignment.resourceId);
//   return resource ? resource.text : '-';
// }
// }

import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DxGanttModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gantt-editor',
  standalone: true,
  templateUrl: './gantt-editor.component.html',
  styleUrls: ['./gantt-editor.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DxGanttModule]
})
export class GanttEditorComponent {
  ganttForm: FormGroup;
  ganttChartVisible = false;
  ganttChartLoading = false;
  ganttChartData: any[] = [];
  skippedTasks: any[] = [];
  ganttDependencies: any[] = [];
  ganttResources: any[] = [];
  ganttAssignments: any[] = [];

  // Modal state
  showTaskModal = false;
  selectedTask: any = null;
  ganttChartReady: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.ganttForm = this.fb.group({
      projectName: ['', Validators.required],
      targetVersion: ['', Validators.required]
    });
  }

  showGanttChart() {
    const projectName = this.ganttForm.value.projectName;
    const targetVersion = this.ganttForm.value.targetVersion;

    if (!projectName || !targetVersion) {
      alert('Project Name and Target Version are required!');
      return;
    }

    this.ganttChartLoading = true;
    this.ganttChartVisible = true;
    this.ganttChartData = [];
    this.skippedTasks = [];
    this.ganttDependencies = [];
    this.ganttResources = [];
    this.ganttAssignments = [];

    const params: any = {
      projectName,
      targetVersion
    };

  //   this.http.get<any>('http://localhost:5238/api/gantt/chart', { params }).subscribe({
  //     next: (data) => {
  //       // Always assign a new array reference for Gantt chart data
  //       this.ganttChartData = [...(data.tasks || []).filter(
  //         (t: any) => !!t.start && !!t.end
  //       )];
  //       this.ganttDependencies = data.dependencies || [];
  //       this.ganttResources = data.resources || [];
  //       this.ganttAssignments = data.assignments || [];
  //       this.skippedTasks = (data.tasks || []).filter(
  //         (t: any) => !t.start || !t.end
  //       );
  //       // Force Angular to check for changes
  //       this.cdr.markForCheck();
  //       this.ganttChartLoading = false;
  //     },
  //     error: (err) => {
  //       alert('Error loading Gantt data');
  //       this.ganttChartLoading = false;
  //     }
  //   });
  // }

  // Double-click row to edit
 

  // saveTaskModal() {
  //   // Save logic: POST to your backend, then reload
  //   const payload = { ...this.selectedTask };
  //   if (payload.dependency !== undefined) {
  //     // If dependency is set, update the dependencies array accordingly
  //     // (You may need to handle this in your backend)
  //   }
  //   this.http.post('http://localhost:5238/api/gantt', payload).subscribe({
  //     next: () => {
  //       this.closeTaskModal();
  //       this.showGanttChart();
  //     },
  //     error: () => alert('Error saving task')
  //   });
  this.ganttChartLoading = true;
this.ganttChartReady = false; // Hide chart before loading

// ... your HTTP call ...
this.http.get<any>('http://localhost:5238/api/gantt/chart', { params }).subscribe({
  next: (data) => {
    // this.ganttChartData = [...(data.tasks || []).filter(
    //   (t: any) => !!t.start && !!t.end
    // )];
    // this.ganttDependencies = data.dependencies || [];
    // this.ganttResources = data.resources || [];
    // this.ganttAssignments = data.assignments || [];
    // this.skippedTasks = (data.tasks || []).filter(
    //   (t: any) => !t.start || !t.end
    // );

    this.ganttChartData = [...(data.tasks || []).filter(
  (t: any) => !!t.start && !!t.end
)];
const validTaskIds = new Set(this.ganttChartData.map(t => t.id));
this.ganttDependencies = (data.dependencies || []).filter(
  (dep: any) => validTaskIds.has(dep.predecessorId) && validTaskIds.has(dep.successorId)
);
this.ganttResources = data.resources || [];
this.ganttAssignments = data.assignments || [];
this.skippedTasks = (data.tasks || []).filter(
  (t: any) => !t.start || !t.end
);
    this.cdr.markForCheck();

    // Force re-render after a short delay
    setTimeout(() => {
      this.ganttChartReady = true;
      this.ganttChartLoading = false;
      this.cdr.markForCheck();
    }, 0);
  },
  error: (err) => {
    alert('Error loading Gantt data');
    this.ganttChartLoading = false;
  }
});
  }
 onRowDblClick(task: any) {
    this.selectedTask = { ...task };
    // Set dependency for modal editing
    const dep = this.ganttDependencies.find(dep => dep.successorId === task.id);
    this.selectedTask.dependency = dep ? dep.predecessorId : null;
    this.showTaskModal = true;
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = null;
  }
  // Helper for displaying dependency in the grid
  getDependency(taskId: number): number | string {
    const dep = this.ganttDependencies.find(dep => dep.successorId === taskId);
    return dep ? dep.predecessorId : '-';
  }

  getResourceName(taskId: number): string {
    const assignment = this.ganttAssignments.find(a => a.taskId === taskId);
    if (!assignment) return '-';
    const resource = this.ganttResources.find(r => r.id === assignment.resourceId);
    return resource ? resource.text : '-';
  }     
}
