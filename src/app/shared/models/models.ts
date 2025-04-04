/* ========== INTERFACES BASE ========== */

export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HasCompany {
  companyIds: string[];
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

/* ========== CLIENTE ========== */

export interface Client extends BaseEntity, Person, HasCompany {
  notes?: string;
  preferences?: {
    preferredServices?: string[];
    preferredProfessionals?: string[];
    notificationPreferences?: {
      email?: boolean;
      sms?: boolean;
      whatsapp?: boolean;
    };
  };
  loyaltyPoints?: number;
  totalSpent?: number;
  lastVisit?: Date;
}

/* ========== PROFISSIONAL ========== */

export interface Professional extends BaseEntity, Person, HasCompany {
  specialties: string[]; // Service IDs
  isActive: boolean;
  commission?: number;
  workingHours?: Record<WeekDay, { start: string; end: string }>;
  daysOff?: Date[];
}

type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/* ========== SERVIÇO ========== */

export interface Service extends BaseEntity, HasCompany {
  categoryId: string;
  name: string;
  description?: string;
  duration: number; // minutos
  price: number;
  isActive: boolean;
  professionalsIds: string[];
}

export interface ServiceCategory extends BaseEntity, HasCompany {
  name: string;
  description?: string;
  order?: number;
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

export interface Appointment extends BaseEntity, HasCompany {
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

/* ========== EMPRESA / SALÃO ========== */

export interface Company extends BaseEntity {
  ownerId: string;
  name: string;
  tradingName?: string;
  cnpj?: string;
  address: Address;
  phone: string;
  email: string;
  logoUrl?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  settings: SalonSettings;
  subscription: Subscription;
  isActive: boolean;
}

export interface SalonSettings {
  businessHours: Partial<Record<WeekDay, { open: string; close: string }>>;
  timeSlotDuration?: number;
  breakBetweenSlots?: number;
  daysInAdvance?: number;
}

export interface Subscription {
  planId: string;
  monthlyFee: number;
  paymentMethod?: string;
  billingDay: number;
  status: 'active' | 'pending' | 'canceled' | 'overdue';
  startsAt: Date;
  expiresAt: Date;
  lastPaymentDate?: Date;
}

/* ========== USUÁRIO ========== */

export interface User extends UserBase {
  companies: UserCompanyPermissions[];
}

export interface UserBase extends Person, BaseEntity {
  email: string;
  password?: string;
  isActive?: boolean;
  lastLogin?: Date;
  profileImageUrl?: string;
}

export interface UserCompanyPermissions {
  companyId: string;
  isAdmin: boolean;
  isEmployee: boolean;
  isOwner: boolean;
  roles?: string[];
  permissions?: string[];
}

/* ========== NOTIFICAÇÃO (opcional por enquanto) ========== */

export interface Notification extends BaseEntity {
  userId: string;
  companyId?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'system' | 'appointment' | 'payment' | 'alert';
  relatedEntity?: {
    type: 'appointment' | 'transaction' | 'client';
    id: string;
  };
  actionUrl?: string;
  createdAt: Date;
}
