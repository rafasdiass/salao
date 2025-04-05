import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';

import { ServicesService } from '../../../shared/services/services.service';
import { EmployeeUser,Service } from '../../../shared/models/models';
@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services-form.component.html',
  styleUrls: ['./services-form.component.scss'],
})
export class ServicesFormComponent {
  // Form data
  categoryId = '';
  name = '';
  description = '';
  duration: number | null = null;
  price: number | null = null;
  isActive = true;
  selectedProfessionals: string[] = [];

  saving = signal(false);
  submitted = false;

  // Data from Firestore
  categories = signal<{ id: string; name: string }[]>([]);
  professionals = signal<EmployeeUser[]>([]);

  // Firestore
  private firestore = inject(Firestore);
  private servicesService = inject(ServicesService);

  constructor() {
    this.loadCategories();
    this.loadProfessionals();
  }

  private async loadCategories() {
    const ref = collection(this.firestore, 'categories');
    const data = await collectionData(ref, { idField: 'id' }).toPromise();
    this.categories.set(data as { id: string; name: string }[]);
  }

  private async loadProfessionals() {
    const ref = collection(this.firestore, 'users');
    const q = query(
      ref,
      where('role', '==', 'employee'),
      where('isActive', '==', true)
    );
    const data = await collectionData(q, { idField: 'id' }).toPromise();
    this.professionals.set(data as EmployeeUser[]);
  }

  toggleProfessional(id: string): void {
    this.selectedProfessionals.includes(id)
      ? (this.selectedProfessionals = this.selectedProfessionals.filter(
          (p) => p !== id
        ))
      : (this.selectedProfessionals = [...this.selectedProfessionals, id]);
  }

  async save(): Promise<void> {
    this.submitted = true;

    if (
      !this.categoryId ||
      !this.name ||
      this.duration == null ||
      this.price == null
    )
      return;

    const service: Omit<Service, 'id'> = {
      categoryId: this.categoryId,
      name: this.name.trim(),
      description: this.description?.trim(),
      duration: this.duration,
      price: this.price,
      isActive: this.isActive,
      professionalsIds: this.selectedProfessionals,
    };

    this.saving.set(true);
    await this.servicesService.create(service);
    this.resetForm();
    this.saving.set(false);
    this.submitted = false;
  }

  resetForm(): void {
    this.categoryId = '';
    this.name = '';
    this.description = '';
    this.duration = null;
    this.price = null;
    this.isActive = true;
    this.selectedProfessionals = [];
  }

  isInvalid(field: any): boolean {
    return (
      this.submitted && (!field || (typeof field === 'string' && !field.trim()))
    );
  }
}
