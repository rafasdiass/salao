import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../shared/models/models';
import { AppointmentService } from '../../../shared/services/appointments.service';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
})
export class AppointmentsListComponent {
  private readonly appointmentService = inject(AppointmentService);

  readonly appointments = this.appointmentService.appointments;
  readonly loading = this.appointmentService.loading;
  readonly error = this.appointmentService.error;

  readonly hasNoAppointments = computed(() => {
    return !this.loading() && this.appointments().length === 0;
  });

  constructor() {
    effect(() => {
      if (!this.loading()) {
        console.log(
          '[Appointments] Agendamentos carregados:',
          this.appointments()
        );
      }
    });
  }

  async onDelete(id: string): Promise<void> {
    const confirmDelete = confirm('Deseja realmente excluir este agendamento?');
    if (!confirmDelete) return;

    await this.appointmentService.delete(id);
  }
}
