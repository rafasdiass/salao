import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { Appointment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly firestore = inject(Firestore);
  private readonly basePath = 'appointments';

  // === Estado interno ===
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // === Computed ===
  readonly appointments = computed(() => this._appointments());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasAppointments = computed(() => this._appointments().length > 0);

  constructor() {
    effect(() => {
      this.loadAppointments();
    });
  }

  /** Carrega todos os agendamentos do Firestore */
  async loadAppointments(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const data = await collectionData(ref, { idField: 'id' }).toPromise();
      this._appointments.set(data as Appointment[]);
    } catch (err) {
      console.error('[AppointmentService] Erro ao carregar agendamentos:', err);
      this._error.set('Erro ao carregar agendamentos');
    } finally {
      this._loading.set(false);
    }
  }

  /** Cria e adiciona um novo agendamento */
  async create(appointment: Omit<Appointment, 'id'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = collection(this.firestore, this.basePath);
      const docRef = await addDoc(ref, appointment);
      const newAppointment: Appointment = { ...appointment, id: docRef.id };
      this._appointments.update((list) => [...list, newAppointment]);
    } catch (err) {
      console.error('[AppointmentService] Erro ao criar agendamento:', err);
      this._error.set('Erro ao criar agendamento');
    } finally {
      this._loading.set(false);
    }
  }

  /** Remove agendamento do Firestore */
  async delete(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await deleteDoc(ref);
      this._appointments.update((list) =>
        list.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error('[AppointmentService] Erro ao excluir agendamento:', err);
      this._error.set('Erro ao excluir agendamento');
    } finally {
      this._loading.set(false);
    }
  }

  /** Atualiza localmente (sem persistência no Firestore) */
  updateLocal(id: string, updated: Partial<Appointment>): void {
    this._appointments.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  }

  /** Atualiza um agendamento no Firestore */
  async update(id: string, updated: Partial<Appointment>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await updateDoc(ref, updated);
      this.updateLocal(id, updated);
    } catch (err) {
      console.error('[AppointmentService] Erro ao atualizar agendamento:', err);
      this._error.set('Erro ao atualizar agendamento');
    } finally {
      this._loading.set(false);
    }
  }

  /** Busca um agendamento por ID */
  getById(id: string): Appointment | undefined {
    return this._appointments().find((item) => item.id === id);
  }
}
