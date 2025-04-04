import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../../shared/services/clients.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss'],
})
export class ClientsFormComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly auth = inject(AuthService);

  form: FormGroup<{
    name: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
    birthDate: FormControl<string>;
    notes: FormControl<string>;
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
    birthDate: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const companyId = this.auth.getCompanyId();
    const raw = this.form.getRawValue();

    const client = {
      ...raw,
      birthDate: new Date(raw.birthDate),
      companyIds: [companyId],
    };

    await this.clientsService.create(client);
    this.form.reset();
  }
}
