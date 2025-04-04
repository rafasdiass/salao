import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private isLocalStorageSupported(): boolean {
    if (!this.isBrowser()) {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn('localStorage não é suportado ou está desabilitado.');
      return false;
    }
  }

  public guardarDados<T>(chave: string, data: T): void {
    if (this.isLocalStorageSupported()) {
      try {
        localStorage.setItem(chave, JSON.stringify(data));
      } catch (error) {
        console.error('Erro ao salvar no localStorage', error);
      }
    } else {
      console.warn(
        'Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.'
      );
    }
  }

  public obterDados<T>(chave: string): T | null {
    if (this.isLocalStorageSupported()) {
      try {
        const dadosSalvos = localStorage.getItem(chave);
        return dadosSalvos ? (JSON.parse(dadosSalvos) as T) : null;
      } catch (error) {
        console.error('Erro ao ler do localStorage', error);
        return null;
      }
    } else {
      console.warn(
        'Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.'
      );
      return null;
    }
  }

  // Alias para obterDados
  public getItem<T>(chave: string): T | null {
    return this.obterDados<T>(chave);
  }

  public limparDados(chave: string): void {
    if (this.isLocalStorageSupported()) {
      try {
        localStorage.removeItem(chave);
      } catch (error) {
        console.error('Erro ao remover do localStorage', error);
      }
    } else {
      console.warn(
        'Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.'
      );
    }
  }
}
