import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LayoutsComponent } from './components/layouts/layouts.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth/:token/:accesstoken',
    component: AuthComponent,
  },
  {
    path: 'fmea',
    component: LayoutsComponent,
    children: [
      {
        path: 'catalogue',
        loadChildren: () => import('catalogue').then((m) => m.CatalogueModule),
      },
      {
        path: 'documentviewer/:documentId/:doctype',
        loadChildren: () => import('documentviewer').then((m) => m.DocumentviewerModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('settings').then((m) => m.SettingsModule)
      },
      {
        path: 'template',
        loadChildren: () => import('template').then((m) => m.TemplateModule)
      },
      {
        path : 'maintenance',
        loadChildren: () => import('maintenance').then((m) => m.MaintenanceModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('reports').then((m) => m.ReportsModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
