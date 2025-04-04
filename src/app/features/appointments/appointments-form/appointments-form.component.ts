import { Component, inject, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { AppointmentService } from '../../../shared/services/appointments.service';
import { ClientsService } from '../../../shared/services/clients.service';
import { ServicesService } from '../../../shared/services/services.service';
import { Client, Service } from '../../../shared/models/models';

@Component({
  selector: 'app-appointments-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments-form.component.html',
})
export class AppointmentsFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly clientsService = inject(ClientsService);
  private readonly servicesService = inject(ServicesService);

  readonly clients: Signal<Client[]> = this.clientsService.clients;
  readonly services: Signal<Service[]> = this.servicesService.services;
  readonly loadingClients = this.clientsService.loading;
  readonly loadingServices = this.servicesService.loading;

  // Tipagem explícita para evitar `string | null`
  form: FormGroup<{
    clientId: FormControl<string>;
    serviceId: FormControl<string>;
    date: FormControl<string>;
    time: FormControl<string>;
    notes: FormControl<string>;
  }> = this.fb.group({
    clientId: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    serviceId: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    time: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: this.fb.control('', { nonNullable: true }),
  });

  selectedService = computed((): Service | null => {
    const serviceId = this.form.controls.serviceId.value;
    return this.services().find((s) => s.id === serviceId) ?? null;
  });

  async submit(): Promise<void> {
    if (this.form.invalid || !this.selectedService()) return;

    const { clientId, serviceId, date, time, notes } = this.form.getRawValue();
    const service = this.selectedService()!;

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    await this.appointmentService.create({
      clientId,
      professionalId: service.professionalsIds[0] ?? '',
      serviceId,
      startTime,
      endTime,
      status: 'scheduled',
      notes,
      price: service.price,
      companyIds: service.companyIds,
      paymentStatus: 'pending',
      createdBy: '',
    });

    this.form.reset();
  }
}
