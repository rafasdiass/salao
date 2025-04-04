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
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // Appointments (pai renderiza list + form)
  {
    path: 'appointments',
    loadComponent: () =>
      import('./features/appointments/appointments.component').then(
        (m) => m.AppointmentsComponent
      ),
  },

  // Clients (pai renderiza list + form)
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/clients/clients.component').then(
        (m) => m.ClientsComponent
      ),
  },

  // Profissionais (pai renderiza list + form)
  {
    path: 'profissionais',
    loadComponent: () =>
      import('./features/profissionais/profissionais.component').then(
        (m) => m.ProfissionaisComponent
      ),
  },

  // Services (pai renderiza list + form)
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services.component').then(
        (m) => m.ServicesComponent
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'home',
  },
];
