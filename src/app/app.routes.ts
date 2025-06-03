import { Routes } from '@angular/router';
import { LoginComponent } from '../lib/components/login/login.component';
import { LaptopDashboardComponent } from '../lib/components/dashboard/dashboard.component';
import { AddLaptopComponent } from '../lib/components/add-laptop/add-laptop.component';
import { EditLaptopComponent } from '../lib/components/edit-laptop/edit-laptop.component';
import { DeleteLaptopComponent } from '../lib/components/delete-laptop/delete-laptop.component';
import { AssetViewComponent } from '../lib/components/asset-view/asset-view.component';




export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: LaptopDashboardComponent },
  {path: 'add-laptop', component: AddLaptopComponent }, 
  { path: 'edit-laptop/:id', component: EditLaptopComponent },
  { path: 'delete-laptop/:id', component: DeleteLaptopComponent },
  { path: 'asset-view/:assetTag', component: AssetViewComponent }

  


];