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
import { firstValueFrom } from 'rxjs';
import { Appointment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly firestore = inject(Firestore);
  private readonly basePath = 'appointments';

  // Estado interno gerenciado por signals
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Computed signals para expor o estado de forma reativa
  readonly appointments = computed(() => this._appointments());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasAppointments = computed(() => this._appointments().length > 0);

  constructor() {
    // Carrega os agendamentos uma vez na inicialização
    this.loadAppointments();
  }

  /** Carrega todos os agendamentos do Firestore */
  async loadAppointments(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const ref = collection(this.firestore, this.basePath);
      const data$ = collectionData(ref, { idField: 'id' });
      const data = await firstValueFrom(data$);
      this._appointments.set(data as Appointment[]);
    } catch (err) {
      console.error('[AppointmentService] Erro ao carregar agendamentos:', err);
      this._error.set('Erro ao carregar agendamentos');
    } finally {
      this._loading.set(false);
    }
  }

  /** Cria e adiciona um novo agendamento no Firestore */
  async create(appointment: Omit<Appointment, 'id'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const ref = collection(this.firestore, this.basePath);
      const docRef = await addDoc(ref, appointment);
      const newAppointment: Appointment = { ...appointment, id: docRef.id };
      this._appointments.update((list: Appointment[]) => [
        ...list,
        newAppointment,
      ]);
    } catch (err) {
      console.error('[AppointmentService] Erro ao criar agendamento:', err);
      this._error.set('Erro ao criar agendamento');
    } finally {
      this._loading.set(false);
    }
  }

  /** Remove um agendamento do Firestore e atualiza o estado local */
  async delete(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const ref = doc(this.firestore, `${this.basePath}/${id}`);
      await deleteDoc(ref);
      this._appointments.update((list: Appointment[]) =>
        list.filter((item: Appointment) => item.id !== id)
      );
    } catch (err) {
      console.error('[AppointmentService] Erro ao excluir agendamento:', err);
      this._error.set('Erro ao excluir agendamento');
    } finally {
      this._loading.set(false);
    }
  }

  /** Atualiza um agendamento no Firestore e atualiza o estado local */
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

  /** Atualiza o estado local (sem persistir no Firestore) */
  updateLocal(id: string, updated: Partial<Appointment>): void {
    this._appointments.update((list: Appointment[]) =>
      list.map((item: Appointment) =>
        item.id === id ? { ...item, ...updated } : item
      )
    );
  }

  /** Busca um agendamento por ID no estado local */
  getById(id: string): Appointment | undefined {
    return this._appointments().find((item: Appointment) => item.id === id);
  }
}
