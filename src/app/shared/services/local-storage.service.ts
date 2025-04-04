import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // Verifica se o código está sendo executado no navegador
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Verifica se o navegador suporta localStorage
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

  // Método para guardar dados no localStorage
  public guardarDados<T>(chave: string, data: T): void {
    if (this.isLocalStorageSupported()) {
      try {
        localStorage.setItem(chave, JSON.stringify(data));
      } catch (error) {
        console.error('Erro ao salvar no localStorage', error);
      }
    } else {
      console.warn('Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.');
    }
  }

  // Método para obter dados do localStorage
  public obterDados<T>(chave: string): T | null {
    if (this.isLocalStorageSupported()) {
      try {
        const dadosSalvos = localStorage.getItem(chave);
        return dadosSalvos ? JSON.parse(dadosSalvos) as T : null;
      } catch (error) {
        console.error('Erro ao ler do localStorage', error);
        return null;
      }
    } else {
      console.warn('Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.');
      return null;
    }
  }

  // Método para remover dados do localStorage
  public limparDados(chave: string): void {
    if (this.isLocalStorageSupported()) {
      try {
        localStorage.removeItem(chave);
      } catch (error) {
        console.error('Erro ao remover do localStorage', error);
      }
    } else {
      console.warn('Tentativa de acessar localStorage em ambiente não suportado ou fora do navegador.');
    }
  }
}
