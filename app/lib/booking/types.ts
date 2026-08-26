export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export type Specialty = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Professional = {
  id: string;
  full_name: string;
  slug: string;
  specialty_id: string;
  specialty_name: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  short_bio: string | null;
  active: boolean;
};

export type BookingService = {
  id: string;
  slug: string;
  name: string;
  specialty_id: string;
  specialty_name: string;
  description: string;
  duration_minutes: number;
  buffer_minutes: number;
  active: boolean;
  reference_price: number | null;
  professionals: Array<{
    id: string;
    full_name: string;
    specialty_name: string;
    photo_url: string | null;
    short_bio: string | null;
    duration_minutes: number | null;
  }>;
};

export type AvailableSlot = {
  professional_id: string;
  professional_name: string;
  start_at: string;
  end_at: string;
  date: string;
  time_label: string;
};

export type Appointment = {
  id: string;
  reservation_code: string;
  status: AppointmentStatus;
  source: "web" | "admin";
  start_at: string;
  end_at: string;
  cancellation_reason: string | null;
  service_id: string;
  service_name: string;
  professional_id: string;
  professional_name: string;
  patient_first_names: string;
  patient_last_names: string;
  patient_rut_masked?: string;
  patient_email: string;
  patient_phone: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingPayload = {
  serviceId: string;
  professionalId: string | null;
  startAt: string;
  patient: {
    firstNames: string;
    lastNames: string;
    rut: string;
    email: string;
    phone: string;
    birthDate: string;
    reason?: string;
    notes?: string;
  };
  acceptsPrivacy: boolean;
  honeypot?: string;
  idempotencyKey: string;
};

export type BookingResult = {
  appointment: Appointment;
  ics: string;
};

export type AdminSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: {
    id: string;
    email?: string;
  };
};
