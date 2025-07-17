import { Routes } from '@angular/router';
import { LoginComponent } from '../lib/components/login/login.component';
import { LaptopDashboardComponent } from '../lib/components/dashboard/dashboard.component';
import { AddLaptopComponent } from '../lib/components/add-laptop/add-laptop.component';
import { EditLaptopComponent } from '../lib/components/edit-laptop/edit-laptop.component';
import { DeleteLaptopComponent } from '../lib/components/delete-laptop/delete-laptop.component';
import { AssetViewComponent } from '../lib/components/asset-view/asset-view.component';
import { AuthGuard } from './auth.guard';
import { LayoutsComponent } from './layouts/layouts.component';
import { PreDashboardComponent } from '../lib/components/pre-dashboard/pre-dashboard.component';
import { AssetDashboardComponent } from '../lib/components/asset-dashboard/asset-dashboard.component';
import { VendorDashboardComponent } from '../lib/components/vendor-dashboard/vendor-dashboard.component';   
import { EmployeeDashboardComponent } from '../lib/components/employee-dashboard/employee-dashboard.component';
import { BugComponent } from '../lib/components/bug/bug.component';
import { GanttEditorComponent } from '../lib/components/gantt-editor/gantt-editor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'asset-view/:assetTag', component: AssetViewComponent }, 
  { path:"assets", component :LayoutsComponent,canActivate: [AuthGuard],

    children: [

  { path: 'dashboard', component: LaptopDashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-laptop', component: AddLaptopComponent, canActivate: [AuthGuard] },
  { path: 'edit-laptop/:id', component: EditLaptopComponent, canActivate: [AuthGuard] },
  { path: 'delete-laptop/:id', component: DeleteLaptopComponent, canActivate: [AuthGuard] },
  { path: 'pre-dashboard', component: PreDashboardComponent, canActivate: [AuthGuard] },
   {path: 'asset-dashboard', component: AssetDashboardComponent, canActivate: [AuthGuard] },
    { path: 'vendor-dashboard', component: VendorDashboardComponent, canActivate: [AuthGuard] },
    { path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [AuthGuard] },
    { path: 'bug', component: BugComponent, canActivate: [AuthGuard] },
    { path: 'gantt-editor', component: GanttEditorComponent, canActivate: [AuthGuard] }
    ]
}

];