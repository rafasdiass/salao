import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('[AdminGuard] Validando rota:', state.url);

    // Recupera o estado do usuário do LocalStorage
    const currentUser: User | null =
      this.localStorageService.getItem<User>('currentUser');

    if (!currentUser) {
      console.warn(
        '[AdminGuard] Usuário não autenticado. Redirecionando para login.'
      );
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }

    console.log('[AdminGuard] Usuário autenticado:', currentUser);

    // Verifica se o usuário tem permissões administrativas
    if (currentUser.role === 'admin') {
      console.log('[AdminGuard] Permissões administrativas confirmadas.');
      return of(true);
    } else {
      console.warn(
        '[AdminGuard] Usuário não possui permissões administrativas.'
      );
      this.router.navigate(['/']);
      return of(false);
    }
  }
}
