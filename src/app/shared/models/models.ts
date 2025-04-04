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

/* ========== CLIENT ========== */
export interface Client extends BaseEntity, Person {
  address: Address;
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

/* ========== PROFESSIONAL (LEGADO - OPCIONAL) ========== */
export interface Professional extends BaseEntity, Person {
  specialties: string[]; // IDs dos serviços que o profissional realiza
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

/* ========== SERVICE ========== */
export interface Service extends BaseEntity {
  categoryId: string;
  name: string;
  description?: string;
  duration: number; // duração em minutos
  price: number;
  isActive: boolean;
  professionalsIds: string[];
}

/* ========== APPOINTMENT ========== */
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'canceled'
  | 'no-show'
  | 'rescheduled';

export type PaymentStatus = 'pending' | 'paid' | 'partial';

export interface Appointment extends BaseEntity {
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
  address: Address; // ✅ Agora todos os usuários possuem endereço
}

/** Usuário administrador */
export interface AdminUser extends UserBase {
  role: 'admin';
  permissions?: string[];
}

/** Usuário cliente */
export interface ClientUser extends UserBase {
  role: 'client';
}

/** Usuário funcionário */
export interface EmployeeUser extends UserBase {
  role: 'employee';
  isActive: boolean;
  specialties: string[];
  commission?: number;
  workingHours?: Record<WeekDay, { start: string; end: string }>;
  daysOff?: Date[];
}

/* ========== NOTIFICAÇÃO ========== */
export interface Notification extends BaseEntity {
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
