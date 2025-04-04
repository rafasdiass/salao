import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../../shared/services/profissionais.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profissionais-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profissionais-form.component.html',
  styleUrls: ['./profissionais-form.component.scss'],
})
export class ProfissionaisFormComponent {
  private readonly professionalService = inject(ProfessionalService);
  private readonly auth = inject(AuthService);

  form: FormGroup<{
    name: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
    specialties: FormControl<string[]>; // aqui
    isActive: FormControl<boolean>;
    commission: FormControl<number>;
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
    specialties: new FormControl<string[]>([], { nonNullable: true }), // CORRIGIDO
    isActive: new FormControl(true, { nonNullable: true }),
    commission: new FormControl(0, { nonNullable: true }),
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const companyId = this.auth.getCompanyId();

    const professional = {
      ...this.form.getRawValue(),
      companyIds: [companyId],
    };

    await this.professionalService.create(professional);
    this.form.reset();
  }

  onSpecialtiesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const values = input.value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
    this.form.controls.specialties.setValue(values);
  }
}
