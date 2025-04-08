/* ========== INTERFACES BASE ========== */
export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Person {
  name: string;
  phone?: string;
  email?: string;
  birthDate?: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

/* ========== EMPRESA ========== */
export interface Company extends BaseEntity {
  name: string;
  cnpj?: string;
  address: Address;
  subscriptionPlanId: string;
  activeUntil?: Date;
  ownerId: string;
  currentAppointmentsCount: number;
}

/* ========== PLANO DE ASSINATURA ========== */
export interface SubscriptionPlan {
  id: string;
  name: 'Free' | 'Pro' | 'Unlimited';
  price: number;
  maxAppointmentsPerMonth: number;
  features: string[];
}

/* ========== CLIENTE GLOBAL ========== */
export interface ClientUser extends UserBase {
  role: 'client';
  favorites?: string[]; // companyIds
}

/* ========== PROFISSIONAL (LEGADO - OPCIONAL) ========== */
export interface Professional extends BaseEntity, Person {
  companyId: string;
  specialties: string[];
  isActive: boolean;
  commission?: number;
  workingHours?: Record<WeekDay, { start: string; end: string }>;
  daysOff?: Date[];
}

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/* ========== SERVIÇO ========== */
export interface Service extends BaseEntity {
  companyId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  professionalsIds: string[];
}

/* ========== AGENDAMENTO ========== */
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'canceled'
  | 'no-show'
  | 'rescheduled';

export type PaymentStatus = 'pending' | 'paid' | 'partial';

export interface Appointment extends BaseEntity {
  companyId: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  cancellationReason?: string;
  createdBy?: string;
}

/* ========== USUÁRIO (UNIFICADO COM ENDEREÇO) ========== */
export type User = AdminUser | ClientUser | EmployeeUser;

export interface UserBase extends Person, BaseEntity {
  email: string;
  password?: string;
  isActive?: boolean;
  lastLogin?: Date;
  profileImageUrl?: string;
  address?: Address;
}

export interface AdminUser extends UserBase {
  role: 'admin';
  companyId: string;
  permissions?: string[];
}

export interface EmployeeUser extends UserBase {
  role: 'employee';
  companyId: string;
  specialties: string[];
  commission?: number;
  workingHours?: Record<WeekDay, { start: string; end: string }>;
  daysOff?: Date[];
}

/* ========== NOTIFICAÇÃO ========== */
export interface Notification extends BaseEntity {
  companyId: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'system' | 'appointment' | 'payment' | 'alert';
  relatedEntity?: {
    type: 'appointment' | 'client';
    id: string;
  };
  actionUrl?: string;
  createdAt: Date;
}
