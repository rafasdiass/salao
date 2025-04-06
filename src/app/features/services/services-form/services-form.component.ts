import {
  Component,
  inject,
  signal,
  computed,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../shared/services/services.service';
import { ProfessionalService } from '../../../shared/services/profissionais.service';
import { EmployeeUser, Service } from '../../../shared/models/models';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services-form.component.html',
  styleUrls: ['./services-form.component.scss'],
})
export class ServicesFormComponent {
  name = '';
  description = '';
  duration: number | null = null;
  price: number | null = null;
  isActive = true;
  selectedProfessionals: string[] = [];

  saving = signal(false);
  submitted = false;

  services = signal<Service[]>([]);
  professionals = signal<EmployeeUser[]>([]);

  private readonly injector = inject(Injector);
  private readonly servicesService = inject(ServicesService);
  private readonly professionalService = inject(ProfessionalService);

  constructor() {
    this.loadServices();
    this.loadProfessionals();
  }

  private async loadServices(): Promise<void> {
    runInInjectionContext(this.injector, () => {
      const loaded = this.servicesService.services();
      this.services.set(loaded);
    });
  }

  private async loadProfessionals(): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      await this.professionalService.load();
      const onlyActive = this.professionalService
        .professionals()
        .filter((p) => p.isActive);
      this.professionals.set(onlyActive);
    });
  }

  toggleProfessional(id: string): void {
    if (this.selectedProfessionals.includes(id)) {
      this.selectedProfessionals = this.selectedProfessionals.filter(
        (p) => p !== id
      );
    } else {
      this.selectedProfessionals = [...this.selectedProfessionals, id];
    }
  }

  isInvalid(field: any): boolean {
    return (
      this.submitted && (!field || (typeof field === 'string' && !field.trim()))
    );
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.duration = null;
    this.price = null;
    this.isActive = true;
    this.selectedProfessionals = [];
  }

  async save(): Promise<void> {
    this.submitted = true;

    if (!this.name || this.duration == null || this.price == null) return;

    const service: Omit<Service, 'id'> = {
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
}
