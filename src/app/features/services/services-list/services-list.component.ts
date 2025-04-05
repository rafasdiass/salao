import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../../shared/services/services.service';
import { Service } from '../../../shared/models/models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent {
  // Injeção do serviço usando API moderna do Angular
  private readonly servicesService: ServicesService = inject(ServicesService);

  // Signals expostos para o template
  services = this.servicesService.services;
  loading = this.servicesService.loading;

  constructor() {
    // Nenhuma lógica adicional necessária no construtor neste caso
  }

  /** Método para excluir um serviço com confirmação */
  async deleteService(id: string): Promise<void> {
    const confirmDelete = confirm(
      'Tem certeza que deseja excluir este serviço?'
    );
    if (confirmDelete) {
      await this.servicesService.delete(id);
    }
  }
}
