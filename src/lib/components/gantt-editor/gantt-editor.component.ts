

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
    selectedResourceId: number | null = null;
  filteredTasks: any[] = [];
   validChartTasks: any[] = [];
  apiBaseUrl = JSON.parse(sessionStorage.getItem('config') || '{}').url;

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
      targetVersion: ['']
    });
  }

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
//      this.ganttChartLoading = true;
// this.ganttChartReady = false; 

//     const params: any = {
//       projectName,
//       targetVersion
//     };


// this.http.get<any>('http://localhost:5238/api/gantt/chart', { params }).subscribe({
//   next: (data) => {
   
//     this.ganttChartData = [...(data.tasks || []).filter(
//   (t: any) => !!t.start && !!t.end
// )];
// const validTaskIds = new Set(this.ganttChartData.map(t => t.id));
// this.ganttDependencies = (data.dependencies || []).filter(
//   (dep: any) => validTaskIds.has(dep.predecessorId) && validTaskIds.has(dep.successorId)
// );
// this.ganttResources = data.resources || [];
// this.ganttAssignments = data.assignments || [];
// this.skippedTasks = (data.tasks || []).filter(
//   (t: any) => !t.start || !t.end
// );
//     this.cdr.markForCheck();

//     // Force re-render after a short delay
//     setTimeout(() => {
//       this.ganttChartReady = true;
//       this.ganttChartLoading = false;
//       this.cdr.markForCheck();
//     }, 0);
//             this.applyResourceFilter(); // <-- Add this line

//   },
//   error: (err) => {
//     alert('Error loading Gantt data');
//     this.ganttChartLoading = false;
//   }
// });
  // }
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
  this.ganttChartReady = false;

  const params: any = { projectName, targetVersion };

   this.http.get<any>(`${this.apiBaseUrl}/api/gantt/chart`, { params }).subscribe({
      next: (data) => {
  // Remove duplicate tasks by id (normalize id as string)
  const seenIds = new Set<string>();
  this.ganttChartData = (data.tasks || []).filter((task: any) => {
    const idStr = String(task.id);
    if (seenIds.has(idStr)) return false;
    seenIds.add(idStr);
    return true;
  });
  this.ganttResources = data.resources || [];
  this.ganttAssignments = data.assignments || [];
  this.ganttDependencies = data.dependencies || [];
  this.skippedTasks = (data.tasks || []).filter((t: any) => !t.start || !t.end);

  this.applyResourceFilter();
  this.cdr.markForCheck();

  // Only allow chart if at least one filtered task has required fields
  this.validChartTasks = this.filteredTasks.filter(t => !!t.start && !!t.end);

  if (this.validChartTasks.length === 0) {
    this.ganttChartReady = false;
    this.ganttChartLoading = false;
    alert('Please fill in all required fields (start and end dates) for at least one task before loading the chart.');
    return;
  }

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
  
 saveTask(task: any) {
  const assignment = this.ganttAssignments.find(a => a.taskId === task.id);
  let resource_Name = null;
  if (assignment) {
    const resource = this.ganttResources.find(r => r.id === assignment.resourceId);
    resource_Name = resource ? resource.text : null;
  }

  const payload = { ...task, resource_Name };

  this.http.post(`${this.apiBaseUrl}/api/gantt/save-task`, payload).subscribe({
    next: () => {
      alert('Task saved!');
      this.showGanttChart(); // reload data
    },
    error: () => alert('Error saving task')
  });
}
 applyResourceFilter() {
    if (!this.selectedResourceId) {
      this.filteredTasks = this.ganttChartData;
    } else {
      // Find all task IDs assigned to the selected resource
      const assignedTaskIds = this.ganttAssignments
        .filter(a => a.resourceId === this.selectedResourceId)
        .map(a => a.taskId);
      this.filteredTasks = this.ganttChartData.filter(task => assignedTaskIds.includes(task.id));
    }
  }
  showGrid: boolean = true;

toggleView() {
  this.showGrid = !this.showGrid;
}

}
