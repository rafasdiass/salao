import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  sections = [
    {
      icon: 'bi-calendar-check',
      label: 'Agendamentos',
      route: '/appointments',
    },
    { icon: 'bi-person', label: 'Clientes', route: '/clients' },
    { icon: 'bi-scissors', label: 'Profissionais', route: '/profissionais' },
    { icon: 'bi-gear', label: 'Serviços', route: '/services' },
  ];
}
