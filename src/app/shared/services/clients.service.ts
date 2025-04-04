import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Client } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly firestore = inject(Firestore);
  private readonly basePath = 'clients';

  private readonly _clients = signal<Client[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly clients = computed(() => this._clients());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasClients = computed(() => this._clients().length > 0);

  constructor() {
    this.loadClients(); // Pode manter aqui, agora que usamos firstValueFrom
  }

  async loadClients(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const data$ = collectionData(ref, {
        idField: 'id',
      }) as unknown as import('rxjs').Observable<Client[]>;
      const clients = await firstValueFrom(data$);
      this._clients.set(clients);
    } catch (err) {
      console.error('[ClientsService] Erro ao carregar clientes:', err);
      this._error.set('Erro ao carregar clientes');
    } finally {
      this._loading.set(false);
    }
  }

  async create(client: Omit<Client, 'id'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const docRef = await addDoc(ref, client);
      const newClient: Client = { ...client, id: docRef.id };
      this._clients.update((list) => [...list, newClient]);
    } catch (err) {
      console.error('[ClientsService] Erro ao criar cliente:', err);
      this._error.set('Erro ao criar cliente');
    } finally {
      this._loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await deleteDoc(ref);
      this._clients.update((list) => list.filter((client) => client.id !== id));
    } catch (err) {
      console.error('[ClientsService] Erro ao excluir cliente:', err);
      this._error.set('Erro ao excluir cliente');
    } finally {
      this._loading.set(false);
    }
  }

  async update(id: string, updated: Partial<Client>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await updateDoc(ref, updated);
      this.updateLocal(id, updated);
    } catch (err) {
      console.error('[ClientsService] Erro ao atualizar cliente:', err);
      this._error.set('Erro ao atualizar cliente');
    } finally {
      this._loading.set(false);
    }
  }

  updateLocal(id: string, updated: Partial<Client>): void {
    this._clients.update((list) =>
      list.map((client) =>
        client.id === id ? { ...client, ...updated } : client
      )
    );
  }

  getById(id: string): Client | undefined {
    return this._clients().find((c) => c.id === id);
  }
}
