import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../models/models';
import { LocalStorageService } from './local-storage.service';

const USER_STORAGE_KEY = 'userData';
// Você pode definir um TTL (por exemplo, 24 horas) se desejar que os dados expirem:
// const USER_TTL = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

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

  constructor(private localStorageService: LocalStorageService) {
    // Carrega os dados do usuário do localStorage, se houver
    const storedUser = this.localStorageService.getItem<User>(USER_STORAGE_KEY);
    if (storedUser) {
      this._user.set(storedUser);
    }

    // Persiste o estado do usuário no localStorage sempre que ele mudar
    effect(() => {
      const currentUser = this._user();
      if (currentUser) {
        // Se desejar utilizar TTL, passe o valor (ex.: USER_TTL)
        this.localStorageService.setItem(USER_STORAGE_KEY, currentUser);
      } else {
        this.localStorageService.removeItem(USER_STORAGE_KEY);
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
