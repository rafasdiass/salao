import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../../shared/services/profissionais.service';
import { EmployeeUser } from '../../../shared/models/models';

@Component({
  selector: 'app-profissionais-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profissionais-form.component.html',
  styleUrls: ['./profissionais-form.component.scss'],
})
export class ProfissionaisFormComponent {
  private readonly professionalService = inject(ProfessionalService);

  form: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    phone: FormControl<string>;
    birthDate: FormControl<string>;
    specialties: FormControl<string[]>;
    commission: FormControl<number>;
    isActive: FormControl<boolean>;
    profileImageUrl: FormControl<string>;
    street: FormControl<string>;
    number: FormControl<string>;
    complement: FormControl<string>;
    neighborhood: FormControl<string>;
    city: FormControl<string>;
    state: FormControl<string>;
    zipCode: FormControl<string>;
    country: FormControl<string>;
  }> = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    phone: new FormControl('', { nonNullable: true }),
    birthDate: new FormControl('', { nonNullable: true }),
    specialties: new FormControl<string[]>([], { nonNullable: true }),
    commission: new FormControl(0, { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
    profileImageUrl: new FormControl('', { nonNullable: true }),

    // Endereço
    street: new FormControl('', { nonNullable: true }),
    number: new FormControl('', { nonNullable: true }),
    complement: new FormControl('', { nonNullable: true }),
    neighborhood: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    state: new FormControl('', { nonNullable: true }),
    zipCode: new FormControl('', { nonNullable: true }),
    country: new FormControl('Brasil', { nonNullable: true }),
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const {
      name,
      email,
      password,
      phone,
      birthDate,
      specialties,
      commission,
      isActive,
      profileImageUrl,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      country,
    } = this.form.getRawValue();

   const professional: Omit<EmployeeUser, 'id'> = {
     role: 'employee',
     name,
     email,
     password,
     phone,
     birthDate: new Date(birthDate),
     specialties,
     commission,
     isActive,
     profileImageUrl: profileImageUrl || undefined,
     createdAt: new Date(),
     updatedAt: new Date(),
     address: {
       street,
       number,
       complement,
       neighborhood,
       city,
       state,
       zipCode,
       country,
     },
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
