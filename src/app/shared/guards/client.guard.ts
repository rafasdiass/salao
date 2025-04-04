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
export class ClientGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('[ClientGuard] Validando rota:', state.url);

    // Recupera o usuário armazenado no localStorage (utilizando o método obterDados)
    const currentUser: User | null =
      this.localStorageService.obterDados<User>('currentUser');

    if (!currentUser) {
      console.warn(
        '[ClientGuard] Usuário não autenticado. Redirecionando para login.'
      );
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }

    console.log('[ClientGuard] Usuário autenticado:', currentUser);

    // Verifica se o usuário possui o papel "client"
    if (currentUser.role === 'client') {
      console.log('[ClientGuard] Permissão de cliente confirmada.');
      return of(true);
    } else {
      console.warn(
        '[ClientGuard] Usuário não possui o papel client. Redirecionando para a home.'
      );
      this.router.navigate(['/']);
      return of(false);
    }
  }
}
