import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Sinal interno para armazenar os dados do usuário
  private readonly _user = signal<User | null>(null);
  // Exposição do sinal como somente leitura
  readonly user = this._user.asReadonly();
  // Sinal computado para indicar se o usuário está logado
  readonly isLoggedIn = computed(() => !!this._user());

  constructor() {
    // Carrega os dados do usuário do localStorage, se houver
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          this._user.set(JSON.parse(storedUser));
        } catch (error) {
          console.error(
            'Erro ao parsear os dados do usuário do storage:',
            error
          );
          this._user.set(null);
        }
      }
    }

    // Persiste o estado do usuário no localStorage sempre que ele mudar
    effect(() => {
      const currentUser = this._user();
      if (currentUser) {
        localStorage.setItem('userData', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('userData');
      }
    });
  }

  /**
   * Define os dados do usuário.
   */
  setUser(user: User): void {
    this._user.set(user);
  }

  /**
   * Retorna os dados do usuário atualmente armazenados.
   */
  getUser(): User | null {
    return this._user();
  }

  /**
   * Limpa os dados do usuário.
   */
  clearUser(): void {
    this._user.set(null);
  }
}
