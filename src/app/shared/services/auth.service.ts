import { Injectable, signal } from '@angular/core';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = signal<boolean>(!!this._user());

  setUser(user: User): void {
    this._user.set(user);
  }

  getCompanyId(): string {
    const user = this._user();
    if (!user || !user.companies?.length) {
      throw new Error('[AuthService] Usuário sem empresa associada');
    }

    return user.companies[0].companyId; // ou lógica mais avançada
  }
}
