import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Professional } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfessionalService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly path = 'professionals';

  private readonly _professionals = signal<Professional[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly professionals = computed(() => this._professionals());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  /** Carrega profissionais filtrando pela empresa da pessoa logada */
  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const companyId = this.auth.getCompanyId();
      const ref = collection(this.firestore, this.path);
      const q = query(ref, where('companyIds', 'array-contains', companyId));
      const data = await collectionData(q, { idField: 'id' }).toPromise();
      this._professionals.set(data as Professional[]);
    } catch (err) {
      console.error(
        '[ProfessionalService] Erro ao carregar profissionais:',
        err
      );
      this._error.set('Erro ao carregar profissionais');
    } finally {
      this._loading.set(false);
    }
  }

  /** Cria um novo profissional associado à empresa logada */
  async create(professional: Omit<Professional, 'id'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.path);
      const docRef = await addDoc(ref, professional);
      this._professionals.update((list) => [
        ...list,
        { ...professional, id: docRef.id },
      ]);
    } catch (err) {
      console.error('[ProfessionalService] Erro ao criar profissional:', err);
      this._error.set('Erro ao criar profissional');
    } finally {
      this._loading.set(false);
    }
  }

  /** Remove um profissional do Firestore e do estado */
  async delete(id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.path}/${id}`);
      await deleteDoc(ref);
      this._professionals.update((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[ProfessionalService] Erro ao excluir profissional:', err);
    }
  }

  /** Atualiza um profissional no Firestore e no estado local */
  async update(id: string, data: Partial<Professional>): Promise<void> {
    try {
      const ref = doc(this.firestore, `${this.path}/${id}`);
      await updateDoc(ref, data);
      this._professionals.update((list) =>
        list.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    } catch (err) {
      console.error(
        '[ProfessionalService] Erro ao atualizar profissional:',
        err
      );
    }
  }

  /** Retorna um profissional pelo ID */
  getById(id: string): Professional | undefined {
    return this._professionals().find((p) => p.id === id);
  }
}
