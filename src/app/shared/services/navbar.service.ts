import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  // Signal para controlar se a navbar está aberta ou fechada.
  public isNavbarOpen = signal<boolean>(false);

  // Método para alternar o estado da navbar.
  toggleNavbar(): void {
    this.isNavbarOpen.update((open) => !open);
  }

  // Método para fechar a navbar.
  closeNavbar(): void {
    this.isNavbarOpen.set(false);
  }
}
