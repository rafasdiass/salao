import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

/**
 * Interface que representa um estabelecimento cadastrado na plataforma.
 */
export interface Establishment {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  companyId: string;
  // Adicione outras propriedades conforme necessário (ex.: telefone, email, etc.)
}

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  private readonly firestore = inject(Firestore);
  private readonly collectionPath = 'establishments';

  // Sinal para armazenar a lista de estabelecimentos.
  private readonly _establishments = signal<Establishment[]>([]);
  // Exposição do sinal como somente leitura.
  readonly establishments = computed(() => this._establishments());

  constructor() {
    // Carrega os estabelecimentos ao inicializar o serviço.
    this.loadEstablishments();
  }

  /**
   * Carrega os estabelecimentos do Firestore e atualiza o sinal _establishments.
   */
  async loadEstablishments(): Promise<void> {
    try {
      const ref = collection(this.firestore, this.collectionPath);
      const data$ = collectionData(ref, { idField: 'id' });
      const data = await firstValueFrom(data$);
      this._establishments.set(data as Establishment[]);
    } catch (error) {
      console.error(
        '[EstablishmentService] Erro ao carregar estabelecimentos:',
        error
      );
    }
  }

  /**
   * Cria um novo estabelecimento no Firestore.
   * @param establishment Dados do estabelecimento a ser criado.
   * @returns Uma Promise que resolve o estabelecimento criado (com o ID gerado) ou null em caso de erro.
   */
  async createEstablishment(
    establishment: Omit<Establishment, 'id'>
  ): Promise<Establishment | null> {
    try {
      const ref = collection(this.firestore, this.collectionPath);
      const docRef = await addDoc(ref, establishment);
      const newEstablishment: Establishment = {
        ...establishment,
        id: docRef.id,
      };
      // Atualiza o estado local.
      this._establishments.update((list) => [...list, newEstablishment]);
      return newEstablishment;
    } catch (error) {
      console.error(
        '[EstablishmentService] Erro ao criar estabelecimento:',
        error
      );
      return null;
    }
  }

  /**
   * Atualiza um estabelecimento existente no Firestore.
   * @param id ID do estabelecimento a ser atualizado.
   * @param updated Dados parciais para atualizar.
   * @returns Uma Promise que resolve true se a atualização for bem-sucedida, false caso contrário.
   */
  async updateEstablishment(
    id: string,
    updated: Partial<Establishment>
  ): Promise<boolean> {
    try {
      const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
      await updateDoc(ref, updated);
      // Atualiza o estado local.
      this._establishments.update((list) =>
        list.map((est) => (est.id === id ? { ...est, ...updated } : est))
      );
      return true;
    } catch (error) {
      console.error(
        '[EstablishmentService] Erro ao atualizar estabelecimento:',
        error
      );
      return false;
    }
  }

  /**
   * Exclui um estabelecimento do Firestore.
   * @param id ID do estabelecimento a ser excluído.
   * @returns Uma Promise que resolve true se a exclusão for bem-sucedida, false caso contrário.
   */
  async deleteEstablishment(id: string): Promise<boolean> {
    try {
      const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
      await deleteDoc(ref);
      // Atualiza o estado local removendo o estabelecimento.
      this._establishments.update((list) =>
        list.filter((est) => est.id !== id)
      );
      return true;
    } catch (error) {
      console.error(
        '[EstablishmentService] Erro ao excluir estabelecimento:',
        error
      );
      return false;
    }
  }

  /**
   * Busca um estabelecimento pelo ID no estado local.
   * @param id ID do estabelecimento.
   * @returns O estabelecimento encontrado ou undefined se não existir.
   */
  getEstablishmentById(id: string): Establishment | undefined {
    return this._establishments().find((est) => est.id === id);
  }
}
