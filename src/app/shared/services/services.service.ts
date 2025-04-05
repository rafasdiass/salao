import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Service } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly firestore = inject(Firestore);
  private readonly basePath = 'services';

  // === Estado interno ===
  private readonly _services = signal<Service[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // === Computed ===
  readonly services = computed(() => this._services());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasServices = computed(() => this._services().length > 0);

  constructor() {
    effect(() => {
      this.loadServices();
    });
  }

  /** Carrega todos os serviços da coleção do Firestore */
  async loadServices(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const data = await collectionData(ref, { idField: 'id' }).toPromise();
      this._services.set(data as Service[]);
    } catch (err) {
      console.error('[ServicesService] Erro ao carregar serviços:', err);
      this._error.set('Erro ao carregar serviços');
    } finally {
      this._loading.set(false);
    }
  }

  /** Adiciona um novo serviço ao Firestore e atualiza localmente */
  async create(service: Omit<Service, 'id'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const docRef = await addDoc(ref, service);
      const newService: Service = { ...service, id: docRef.id };
      this._services.update((list) => [...list, newService]);
    } catch (err) {
      console.error('[ServicesService] Erro ao criar serviço:', err);
      this._error.set('Erro ao criar serviço');
    } finally {
      this._loading.set(false);
    }
  }

  /** Remove um serviço do Firestore e atualiza localmente */
  async delete(serviceId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${serviceId}`);
      await deleteDoc(ref);
      this._services.update((list) => list.filter((s) => s.id !== serviceId));
    } catch (err) {
      console.error('[ServicesService] Erro ao excluir serviço:', err);
      this._error.set('Erro ao excluir serviço');
    } finally {
      this._loading.set(false);
    }
  }

  /** Atualiza um serviço no Firestore e localmente */
  async update(
    id: string,
    updated: Partial<Omit<Service, 'id'>>
  ): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await updateDoc(ref, updated);
      this.updateLocal(id, updated);
    } catch (err) {
      console.error('[ServicesService] Erro ao atualizar serviço:', err);
      this._error.set('Erro ao atualizar serviço');
    } finally {
      this._loading.set(false);
    }
  }

  /** Atualiza localmente sem persistir */
  updateLocal(id: string, updated: Partial<Omit<Service, 'id'>>): void {
    this._services.update((list) =>
      list.map((service) =>
        service.id === id ? { ...service, ...updated } : service
      )
    );
  }

  /** Busca um serviço por ID */
  getById(id: string): Service | undefined {
    return this._services().find((s) => s.id === id);
  }
}
