export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO string
  time: string; // Ex: '14:30'
  notes?: string;
}
