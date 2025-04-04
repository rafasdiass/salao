import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../../shared/services/clients.service';
import { Client } from '../../../shared/models/models';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss'],
})
export class ClientsFormComponent {
  private readonly clientsService = inject(ClientsService);

  form: FormGroup<{
    name: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
    birthDate: FormControl<string>;
    notes: FormControl<string>;
    address: FormGroup<{
      street: FormControl<string>;
      number: FormControl<string>;
      complement: FormControl<string>;
      neighborhood: FormControl<string>;
      city: FormControl<string>;
      state: FormControl<string>;
      zipCode: FormControl<string>;
      country: FormControl<string>;
    }>;
  }> = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl('', { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl('', { nonNullable: true }),
    address: new FormGroup({
      street: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      complement: new FormControl('', { nonNullable: true }),
      neighborhood: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      state: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      zipCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      country: new FormControl('Brazil', { nonNullable: true }),
    }),
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const birthDate = this.toValidDate(raw.birthDate);
    if (!birthDate) {
      alert('Data de nascimento inválida.');
      return;
    }

    const client: Omit<Client, 'id'> = {
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      birthDate,
      notes: raw.notes,
      address: {
        street: raw.address.street,
        number: raw.address.number,
        complement: raw.address.complement,
        neighborhood: raw.address.neighborhood,
        city: raw.address.city,
        state: raw.address.state,
        zipCode: raw.address.zipCode,
        country: raw.address.country,
      },
    };

    await this.clientsService.create(client);
    this.form.reset();
  }

  /**
   * Converte uma string de data em objeto Date válido ou retorna undefined.
   */
  private toValidDate(input: string): Date | undefined {
    const date = new Date(input);
    return isNaN(date.getTime()) ? undefined : date;
  }
}
