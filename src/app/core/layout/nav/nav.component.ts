import { Component, HostListener, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../../shared/services/navbar.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  // Lista de links de navegação do sistema.
  public navLinks = [
    { label: 'Home', route: '/home', icon: 'bi-house-door' },
    {
      label: 'Agendamentos',
      route: '/appointments',
      icon: 'bi-calendar-check',
    },
    { label: 'Clientes', route: '/clients', icon: 'bi-person' },
    { label: 'Profissionais', route: '/profissionais', icon: 'bi-people' },
    { label: 'Serviços', route: '/services', icon: 'bi-gear' },
  ];

  constructor(public navbarService: NavbarService) {
    // Efeito para monitorar e logar alterações no estado da navbar.
    effect(() => {
      console.log('Estado da Navbar:', this.navbarService.isNavbarOpen());
    });
  }

  // Método chamado ao clicar no botão de toggle da navbar.
  toggleNavbar(): void {
    this.navbarService.toggleNavbar();
  }

  // Listener para fechar a navbar ao clicar fora dela.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar')) {
      this.navbarService.closeNavbar();
    }
  }
}
