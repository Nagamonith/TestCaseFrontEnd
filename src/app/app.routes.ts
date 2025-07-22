import { Routes } from '@angular/router';

/* ───────── Existing imports ───────── */
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

/* ───────── New Tester Dashboard imports ───────── */
import { ProductSelectionComponent } from '../testcase/product-selection/product-selection.component';
import { TesterDashboardComponent } from '../testcase/tester-dashboard/tester-dashboard.component';
import { AddTestcasesComponent } from '../testcase/add-testcases/add-testcases.component';
import { ImportExcelComponent } from '../testcase/import-excel/import-excel.component';
import { ModulesComponent } from '../testcase/modules/modules.component';
import { ResultsComponent } from '../testcase/results/results.component';
import { SummaryComponent } from '../testcase/summary/summary.component';

export const routes: Routes = [
  /* ───────── Public / login section ───────── */
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  /* ───────── Asset-management section (guarded) ───────── */
  { path: 'asset-view/:assetTag', component: AssetViewComponent },
  {
    path: 'assets',
    component: LayoutsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: LaptopDashboardComponent },
      { path: 'add-laptop', component: AddLaptopComponent },
      { path: 'edit-laptop/:id', component: EditLaptopComponent },
      { path: 'delete-laptop/:id', component: DeleteLaptopComponent },
      { path: 'pre-dashboard', component: PreDashboardComponent },
      { path: 'asset-dashboard', component: AssetDashboardComponent },
      { path: 'vendor-dashboard', component: VendorDashboardComponent },
      { path: 'employee-dashboard', component: EmployeeDashboardComponent },
      { path: 'bug', component: BugComponent },
      { path: 'gantt-editor', component: GanttEditorComponent }
    ]
  },

  /* ───────── Tester Dashboard section ───────── */
  {
    path: '',
    component: LayoutsComponent,
    children: [
      { path: 'select-product', component: ProductSelectionComponent },
      {
        path: 'tester',
        component: TesterDashboardComponent,
        children: [
          { path: 'add-testcases', component: AddTestcasesComponent },
          {
            path: 'edit-testcases/:moduleId/:version',
            loadComponent: () =>
              import('../testcase/edit-testcases/edit-testcases.component')
                .then(m => m.EditTestcasesComponent)
          },
          { path: 'import-excel', component: ImportExcelComponent },
          { path: 'modules', component: ModulesComponent },
          { path: 'results', component: ResultsComponent },
          { path: 'summary', component: SummaryComponent },
          { path: '', redirectTo: 'add-testcases', pathMatch: 'full' }
        ]
      }
    ]
  }
];
