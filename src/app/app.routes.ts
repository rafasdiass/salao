import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/admin/home/home.component').then((m) => m.HomeComponent),
  },

  // Appointments (pai renderiza list + form)
  {
    path: 'appointments',
    loadComponent: () =>
      import('./features/clientes/appointments/appointments.component').then(
        (m) => m.AppointmentsComponent
      ),
  },

  // Clients (pai renderiza list + form)
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/admin/clients/clients.component').then(
        (m) => m.ClientsComponent
      ),
  },

  // Profissionais (pai renderiza list + form)
  {
    path: 'profissionais',
    loadComponent: () =>
      import('./features/admin/profissionais/profissionais.component').then(
        (m) => m.ProfissionaisComponent
      ),
  },

  // Services (pai renderiza list + form)
  {
    path: 'services',
    loadComponent: () =>
      import('./features/admin/services/services.component').then(
        (m) => m.ServicesComponent
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'home',
  },
];
