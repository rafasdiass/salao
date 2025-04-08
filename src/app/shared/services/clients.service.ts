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
import { ClientUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly firestore = inject(Firestore);
  private readonly basePath = 'clients';

  private readonly _clients = signal<ClientUser[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly clients = computed(() => this._clients());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasClients = computed(() => this._clients().length > 0);

  constructor() {
    this.loadClients();
  }

  async loadClients(): Promise<void> {
    this.setLoading(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const data$ = collectionData(ref, {
        idField: 'id',
      }) as unknown as import('rxjs').Observable<ClientUser[]>;
      const clients = await firstValueFrom(data$);
      this._clients.set(clients);
    } catch (err) {
      console.error('[ClientsService] Erro ao carregar clientes:', err);
      this._error.set('Erro ao carregar clientes');
    } finally {
      this.setLoading(false);
    }
  }

  async create(client: Omit<ClientUser, 'id'>): Promise<void> {
    this.setLoading(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const docRef = await addDoc(ref, client);
      const newClient: ClientUser = { ...client, id: docRef.id };
      this._clients.update((list) => [...list, newClient]);
    } catch (err) {
      console.error('[ClientsService] Erro ao criar cliente:', err);
      this._error.set('Erro ao criar cliente');
    } finally {
      this.setLoading(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.setLoading(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await deleteDoc(ref);
      this._clients.update((list) => list.filter((client) => client.id !== id));
    } catch (err) {
      console.error('[ClientsService] Erro ao excluir cliente:', err);
      this._error.set('Erro ao excluir cliente');
    } finally {
      this.setLoading(false);
    }
  }

  async update(id: string, updated: Partial<ClientUser>): Promise<void> {
    this.setLoading(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await updateDoc(ref, updated);
      this.updateLocal(id, updated);
    } catch (err) {
      console.error('[ClientsService] Erro ao atualizar cliente:', err);
      this._error.set('Erro ao atualizar cliente');
    } finally {
      this.setLoading(false);
    }
  }

  updateLocal(id: string, updated: Partial<ClientUser>): void {
    this._clients.update((list) =>
      list.map((client) =>
        client.id === id ? { ...client, ...updated } : client
      )
    );
  }

  getById(id: string): ClientUser | undefined {
    return this._clients().find((client) => client.id === id);
  }

  private setLoading(state: boolean): void {
    this._loading.set(state);
  }
}
