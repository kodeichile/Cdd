"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AvailableSlot, BookingResult, BookingService, Professional } from "@/app/lib/booking/types";
import servicesData from "@/data/services.json";
import professionalsData from "@/data/professionals.json";
import {
  formatChileDate,
  formatChileDateTime,
  formatChileTime,
  normalizeChileanPhone,
  normalizeRut,
  validatePatientPayload,
} from "@/app/lib/booking/validation";

const steps = ["Tratamiento", "Profesional", "Fecha y hora", "Datos", "Solicitud"];
const clinicAppointmentEmail = process.env.NEXT_PUBLIC_CLINIC_APPOINTMENT_EMAIL || "hola@centromedicodental.cl";
const appointmentRequestEndpoint = process.env.NEXT_PUBLIC_APPOINTMENT_REQUEST_ENDPOINT || "";

type PatientForm = {
  firstNames: string;
  lastNames: string;
  rut: string;
  email: string;
  phone: string;
  birthDate: string;
  reason: string;
  notes: string;
  acceptsPrivacy: boolean;
  website: string;
};

const initialPatient: PatientForm = {
  firstNames: "",
  lastNames: "",
  rut: "",
  email: "",
  phone: "",
  birthDate: "",
  reason: "",
  notes: "",
  acceptsPrivacy: false,
  website: "",
};

const demoCatalog = buildDemoCatalog();
const firstDemoTreatmentCategory = demoCatalog.services[0]?.specialty_name ?? "";

function todayIsoDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function monthLabel(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
  }).format(value);
}

function buildMonthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const days: Array<{ date: string; day: number; inMonth: boolean }> = [];

  for (let index = 0; index < startOffset; index += 1) {
    const date = new Date(first);
    date.setDate(first.getDate() - startOffset + index);
    days.push({ date: date.toISOString().slice(0, 10), day: date.getDate(), inMonth: false });
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    days.push({ date: date.toISOString().slice(0, 10), day, inMonth: true });
  }

  while (days.length % 7 !== 0) {
    const date = new Date(last);
    date.setDate(last.getDate() + (days.length % 7) + 1);
    days.push({ date: date.toISOString().slice(0, 10), day: date.getDate(), inMonth: false });
  }

  return days;
}

function buildDemoCatalog() {
  const professionals = professionalsData.map((person, index): Professional => ({
    id: `demo-professional-${index + 1}`,
    full_name: person.name,
    slug: person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    specialty_id: `demo-specialty-${person.specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    specialty_name: person.specialty,
    photo_url: "/team-photo.png",
    email: null,
    phone: null,
    short_bio: person.bio,
    active: true,
  }));

  const services = servicesData.map((service, index): BookingService => {
    const enabledProfessionals = professionals.filter((person) => professionalMatchesService(person, service.category));
    const fallbackProfessionals = enabledProfessionals.length ? enabledProfessionals : professionals.slice(0, 3);

    return {
      id: `demo-service-${index + 1}`,
      slug: service.slug,
      name: service.title,
      specialty_id: `demo-specialty-${service.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      specialty_name: service.category,
      description: service.description,
      duration_minutes: demoDuration(service.category),
      buffer_minutes: service.category === "Implantes" ? 15 : 10,
      active: true,
      reference_price: null,
      professionals: fallbackProfessionals.map((person) => ({
        id: person.id,
        full_name: person.full_name,
        specialty_name: person.specialty_name,
        photo_url: person.photo_url,
        short_bio: person.short_bio,
        duration_minutes: null,
      })),
    };
  });

  return { services, professionals };
}

function professionalMatchesService(person: Professional, category: string) {
  const specialty = person.specialty_name.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("ortodoncia")) {
    return specialty.includes("ortodon");
  }
  if (normalizedCategory.includes("implantes")) {
    return specialty.includes("implant");
  }
  if (normalizedCategory.includes("ninos")) {
    return specialty.includes("pediatra");
  }
  if (normalizedCategory.includes("estetica")) {
    return specialty.includes("estetica");
  }
  if (normalizedCategory.includes("prevencion")) {
    return specialty.includes("periodonc") || specialty.includes("estetica");
  }
  if (normalizedCategory.includes("urgencias")) {
    return specialty.includes("endodonc") || specialty.includes("implant");
  }
  return false;
}

function demoDuration(category: string) {
  if (category === "Implantes") {
    return 60;
  }
  if (category === "Urgencias") {
    return 45;
  }
  if (category === "Ninos") {
    return 40;
  }
  return 50;
}

function buildDemoSlots(input: {
  service: BookingService | null;
  professionalId: string | null;
  month: Date;
}) {
  if (!input.service) {
    return [];
  }

  const start = new Date(input.month.getFullYear(), input.month.getMonth(), 1);
  const end = new Date(input.month.getFullYear(), input.month.getMonth() + 1, 0);
  const today = todayIsoDate();
  const times = ["09:00", "10:20", "11:40", "15:00", "16:20", "17:40"];
  const professionals = input.service.professionals.filter((person) => !input.professionalId || person.id === input.professionalId);
  const slots: AvailableSlot[] = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const day = date.toISOString().slice(0, 10);
    const weekday = date.getDay();

    if (day < today || weekday === 0 || weekday === 6 || date.getDate() % 9 === 0) {
      continue;
    }

    professionals.forEach((person, personIndex) => {
      times.forEach((time, timeIndex) => {
        if ((date.getDate() + timeIndex + personIndex) % 4 === 0) {
          return;
        }

        const [hour, minute] = time.split(":").map(Number);
        const startAt = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour + 4, minute));
        const endAt = new Date(startAt.getTime() + (input.service!.duration_minutes + input.service!.buffer_minutes) * 60_000);

        slots.push({
          professional_id: person.id,
          professional_name: person.full_name,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          date: day,
          time_label: time,
        });
      });
    });
  }

  return slots.slice(0, 90);
}

function buildDemoIcs(input: {
  code: string;
  serviceName: string;
  professionalName: string;
  startAt: string;
  endAt: string;
}) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(".000", "");
  const start = new Date(input.startAt).toISOString().replace(/[-:]/g, "").replace(".000", "");
  const end = new Date(input.endAt).toISOString().replace(/[-:]/g, "").replace(".000", "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Denticlass Consulta Dental//Vista Agenda//ES",
    "BEGIN:VEVENT",
    `UID:${input.code}@centromedicodental.cl`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Hora dental - ${input.serviceName}`,
    `DESCRIPTION:Reserva ${input.code}. Profesional: ${input.professionalName}.`,
    "LOCATION:Strip Center Paseo Alcorta segundo piso",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function buildAppointmentRequest(input: {
  code: string;
  service: BookingService;
  slot: AvailableSlot;
  patient: ReturnType<typeof validatePatientPayload>["patient"];
}) {
  const patientName = `${input.patient.firstNames} ${input.patient.lastNames}`.trim();
  const appointmentDate = formatChileDateTime(input.slot.start_at);
  const message = [
    "Nueva solicitud de hora desde la pagina web.",
    "",
    `Codigo de solicitud: ${input.code}`,
    `Estado sugerido: Pendiente de validacion por secretaria`,
    "",
    "Datos de la hora solicitada:",
    `Servicio: ${input.service.name}`,
    `Especialidad: ${input.service.specialty_name}`,
    `Profesional: ${input.slot.professional_name}`,
    `Fecha y hora solicitada: ${appointmentDate}`,
    `Duracion aproximada: ${input.service.duration_minutes} minutos`,
    "",
    "Datos del paciente:",
    `Nombre: ${patientName}`,
    `RUT: ${input.patient.rut}`,
    `Correo: ${input.patient.email}`,
    `Telefono: ${input.patient.phone}`,
    `Fecha de nacimiento: ${input.patient.birthDate}`,
    input.patient.reason ? `Motivo general: ${input.patient.reason}` : "",
    input.patient.notes ? `Observaciones: ${input.patient.notes}` : "",
    "",
    "Accion requerida: validar disponibilidad y contactar al paciente para confirmar o reprogramar.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    patientName,
    appointmentDate,
    subject: `Solicitud de hora dental ${input.code} - ${patientName}`,
    message,
  };
}

async function sendAppointmentRequest(input: {
  code: string;
  service: BookingService;
  slot: AvailableSlot;
  patient: ReturnType<typeof validatePatientPayload>["patient"];
}) {
  const request = buildAppointmentRequest(input);

  if (appointmentRequestEndpoint) {
    const formData = new FormData();
    formData.append("_subject", request.subject);
    formData.append("_replyto", input.patient.email);
    formData.append("tipo_solicitud", "Agenda dental");
    formData.append("codigo", input.code);
    formData.append("paciente", request.patientName);
    formData.append("rut", input.patient.rut);
    formData.append("correo", input.patient.email);
    formData.append("telefono", input.patient.phone);
    formData.append("servicio", input.service.name);
    formData.append("especialidad", input.service.specialty_name);
    formData.append("profesional", input.slot.professional_name);
    formData.append("fecha_hora", request.appointmentDate);
    formData.append("duracion", `${input.service.duration_minutes} minutos`);
    formData.append("mensaje", request.message);

    const response = await fetch(appointmentRequestEndpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar la solicitud al correo de la clinica.");
    }

    return "endpoint" as const;
  }

  const mailto = new URL(`mailto:${clinicAppointmentEmail}`);
  mailto.searchParams.set("subject", request.subject);
  mailto.searchParams.set("body", request.message);
  window.location.href = mailto.toString();
  return "email_app" as const;
}

function downloadIcs(ics: string, code: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hora-dental-${code}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AgendaForm() {
  const visualMode = true;
  const [catalog] = useState<{
    services: BookingService[];
    professionals: Professional[];
  }>(demoCatalog);
  const [catalogStatus] = useState<"idle" | "loading" | "ready" | "error">("ready");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(demoCatalog.services[0]?.id ?? "");
  const [activeTreatmentCategory, setActiveTreatmentCategory] = useState(firstDemoTreatmentCategory);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date(`${todayIsoDate()}T12:00:00`));
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsStatus, setSlotsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [patient, setPatient] = useState<PatientForm>(initialPatient);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<"endpoint" | "email_app" | null>(null);

  const selectedService = catalog.services.find((service) => service.id === serviceId) ?? null;
  const availableProfessionals = useMemo(() => selectedService?.professionals ?? [], [selectedService]);
  const treatmentCategories = useMemo(
    () => Array.from(new Set(catalog.services.map((service) => service.specialty_name))).filter(Boolean),
    [catalog.services],
  );
  const visibleServices = useMemo(
    () => catalog.services.filter((service) => service.specialty_name === activeTreatmentCategory),
    [activeTreatmentCategory, catalog.services],
  );
  const calendarDays = useMemo(() => buildMonthDays(month), [month]);
  const slotsByDate = useMemo(() => {
    return slots.reduce<Record<string, AvailableSlot[]>>((grouped, slot) => {
      grouped[slot.date] = [...(grouped[slot.date] ?? []), slot];
      return grouped;
    }, {});
  }, [slots]);

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    void Promise.resolve().then(() => {
      setSlots(buildDemoSlots({ service: selectedService, professionalId, month }));
      setSlotsStatus("ready");
      setSelectedSlot(null);
    });
  }, [month, professionalId, selectedService, serviceId]);

  function nextStep() {
    setMessage("");

    if (step === 0 && !serviceId) {
      setMessage("Selecciona un tratamiento para continuar.");
      return;
    }

    if (step === 2 && !selectedSlot) {
      setMessage("Selecciona una fecha y una hora disponible.");
      return;
    }

    if (step === 3) {
      const validation = validatePatientPayload(patient);
      setErrors(validation.errors);
      if (!validation.ok) {
        setMessage("Revisa los campos marcados antes de continuar.");
        return;
      }
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setMessage("");
    setStep((current) => Math.max(current - 1, 0));
  }

  function updatePatient<K extends keyof PatientForm>(field: K, value: PatientForm[K]) {
    setPatient((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function submitBooking() {
    if (!selectedService || !selectedSlot) {
      return;
    }

    const validation = validatePatientPayload(patient);
    setErrors(validation.errors);

    if (!validation.ok) {
      setStep(3);
      setMessage("Revisa los campos marcados antes de confirmar.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      const code = `CMD-SOL-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
      const sentBy = await sendAppointmentRequest({
        code,
        service: selectedService,
        slot: selectedSlot,
        patient: validation.patient,
      });
      setDeliveryMode(sentBy);
      setBooking({
        appointment: {
          id: `request-${code}`,
          reservation_code: code,
          status: "pending",
          source: "web",
          start_at: selectedSlot.start_at,
          end_at: selectedSlot.end_at,
          cancellation_reason: null,
          service_id: selectedService.id,
          service_name: selectedService.name,
          professional_id: selectedSlot.professional_id,
          professional_name: selectedSlot.professional_name,
          patient_first_names: validation.patient.firstNames,
          patient_last_names: validation.patient.lastNames,
          patient_email: validation.patient.email,
          patient_phone: validation.patient.phone,
          reason: validation.patient.reason || null,
          notes: validation.patient.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ics: buildDemoIcs({
          code,
          serviceName: selectedService.name,
          professionalName: selectedSlot.professional_name,
          startAt: selectedSlot.start_at,
          endAt: selectedSlot.end_at,
        }),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (booking) {
    return (
      <div className="grid gap-6">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <p className="text-sm font-black uppercase tracking-[0.14em]">Solicitud enviada</p>
          <h2 className="mt-2 text-3xl font-black">Codigo {booking.appointment.reservation_code}</h2>
          <p className="mt-3 leading-7">
            {deliveryMode === "endpoint"
              ? "La solicitud fue enviada al correo de la clinica. Secretaria revisara la hora y contactara al paciente para confirmar."
              : "Se abrio el correo con la solicitud lista para enviar a la clinica. Secretaria debe validar la hora antes de confirmarla."}
          </p>
        </div>
        <div className="grid gap-3 rounded-lg border border-emerald-100 bg-white p-5 text-sm text-slate-700">
          <SummaryLine label="Servicio" value={booking.appointment.service_name} />
          <SummaryLine label="Profesional" value={booking.appointment.professional_name} />
          <SummaryLine label="Fecha y hora" value={formatChileDateTime(booking.appointment.start_at)} />
          <SummaryLine label="Duracion" value={`${selectedService?.duration_minutes ?? 0} minutos`} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="btn-secondary" href="/">
            Volver al inicio
          </Link>
          <button
            className="btn-primary"
            type="button"
            onClick={() => downloadIcs(booking.ics, booking.appointment.reservation_code)}
          >
            Agregar al calendario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-7">
      <div className="grid gap-3 sm:grid-cols-5">
        {steps.map((label, index) => (
          <button
            key={label}
            className={`rounded-lg border px-3 py-3 text-left text-sm font-bold ${
              index === step
                ? "border-[#2f8f5b] bg-[#2f8f5b] text-white"
                : index < step
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 bg-white text-slate-500"
            }`}
            type="button"
            onClick={() => (index < step ? setStep(index) : undefined)}
          >
            <span className="block text-xs uppercase tracking-[0.12em]">Paso {index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      {message ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          {message}
        </div>
      ) : null}

      {catalogStatus === "loading" ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm font-semibold text-emerald-900">
          Cargando tratamientos y profesionales disponibles...
        </div>
      ) : null}

      {step === 0 ? (
        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Elige tu tratamiento</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Selecciona una seccion para ver solo los tratamientos relacionados.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 rounded-lg border border-emerald-100 bg-white p-2">
            {treatmentCategories.map((category) => {
              const count = catalog.services.filter((service) => service.specialty_name === category).length;
              return (
                <button
                  key={category}
                  className={`min-w-0 rounded-lg px-3 py-2 text-left text-[0.72rem] font-black uppercase tracking-normal transition ${
                    activeTreatmentCategory === category
                      ? "bg-[#2f8f5b] text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  }`}
                  type="button"
                  onClick={() => {
                    const firstService = catalog.services.find((service) => service.specialty_name === category);
                    setActiveTreatmentCategory(category);
                    if (firstService) {
                      setServiceId(firstService.id);
                    }
                    setProfessionalId(null);
                    setSelectedDate("");
                    setSelectedSlot(null);
                  }}
                >
                  <span className="block whitespace-nowrap">{category}</span>
                  <span className="block text-[0.68rem] font-bold normal-case tracking-normal opacity-80">
                    {count} {count === 1 ? "tratamiento" : "tratamientos"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
            {visibleServices.map((service) => (
              <button
                key={service.id}
                className={`min-w-0 rounded-lg border p-4 text-left transition ${
                  serviceId === service.id ? "border-[#2f8f5b] bg-emerald-50 shadow-sm" : "border-emerald-100 bg-white hover:border-emerald-300"
                }`}
                type="button"
                onClick={() => {
                  setServiceId(service.id);
                  setProfessionalId(null);
                  setSelectedDate("");
                  setSelectedSlot(null);
                }}
              >
                <span className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-800">
                  {service.specialty_name}
                </span>
                <h3 className="break-words text-lg font-black text-slate-950">{service.name}</h3>
                <p className="mt-2 break-words text-sm leading-5 text-slate-600">{service.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span>{service.duration_minutes} min</span>
                  <span>{service.buffer_minutes} min preparacion</span>
                  <span>{service.professionals.length} profesionales</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-slate-950">Elige profesional</h2>
          <button
            className={`rounded-lg border p-5 text-left ${
              professionalId === null ? "border-[#2f8f5b] bg-emerald-50" : "border-emerald-100 bg-white"
            }`}
            type="button"
            onClick={() => setProfessionalId(null)}
          >
            <h3 className="text-lg font-black text-slate-950">Cualquier profesional disponible</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {visualMode
                ? "Te mostraremos los dentistas habilitados para este tratamiento."
                : "Te mostraremos los horarios disponibles de los dentistas habilitados para este tratamiento."}
            </p>
          </button>
          <div className="grid gap-4 md:grid-cols-2">
            {availableProfessionals.map((person, index) => (
              <button
                key={person.id}
                className={`rounded-lg border p-5 text-left transition ${
                  professionalId === person.id ? "border-[#2f8f5b] bg-emerald-50 shadow-sm" : "border-emerald-100 bg-white hover:border-emerald-300"
                }`}
                type="button"
                onClick={() => setProfessionalId(person.id)}
              >
                <div className="photo-frame mb-4 aspect-[1.55/1]">
                  <img
                    src={person.photo_url ?? "/team-photo.png"}
                    alt={`Foto profesional de ${person.full_name}`}
                    style={{ objectPosition: `${[12, 32, 52, 72, 88][index] ?? 50}% 42%` }}
                  />
                </div>
                <h3 className="text-lg font-black text-slate-950">{person.full_name}</h3>
                <p className="mt-1 font-bold text-emerald-800">{person.specialty_name}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{person.short_bio}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Selecciona fecha y hora</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {visualMode
                  ? "Solo aparecen dias habilitados para solicitar una hora."
                  : "Solo aparecen dias con disponibilidad para solicitar una hora."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="btn-secondary min-h-10 px-4 py-2"
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              >
                Anterior
              </button>
              <button
                className="btn-secondary min-h-10 px-4 py-2"
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              >
                Siguiente
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-4">
            <div className="mb-4 text-center text-lg font-black capitalize text-slate-950">{monthLabel(month)}</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-black uppercase tracking-[0.12em] text-emerald-800">
              {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
                <span key={day} className="py-2">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const disabled = !day.inMonth || day.date < todayIsoDate() || !slotsByDate[day.date]?.length;
                return (
                  <button
                    key={day.date}
                    className={`min-h-12 rounded-lg border text-sm font-bold ${
                      selectedDate === day.date
                        ? "border-[#2f8f5b] bg-[#2f8f5b] text-white"
                        : disabled
                          ? "border-transparent bg-slate-50 text-slate-300"
                          : "border-emerald-100 bg-emerald-50 text-emerald-900 hover:border-emerald-300"
                    }`}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedSlot(null);
                    }}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3">
            <h3 className="text-lg font-black text-slate-950">
              {selectedDate ? `Horarios para ${formatChileDate(selectedDate)}` : "Elige un dia disponible"}
            </h3>
            {slotsStatus === "loading" ? <p className="text-sm font-semibold text-emerald-800">Actualizando disponibilidad...</p> : null}
            {selectedDate ? (
              <div className="grid gap-2 sm:grid-cols-3">
                {(slotsByDate[selectedDate] ?? []).map((slot) => (
                  <button
                    key={`${slot.professional_id}-${slot.start_at}`}
                    className={`rounded-lg border px-4 py-3 text-left ${
                      selectedSlot?.start_at === slot.start_at && selectedSlot.professional_id === slot.professional_id
                        ? "border-[#2f8f5b] bg-emerald-50"
                        : "border-emerald-100 bg-white hover:border-emerald-300"
                    }`}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <span className="block text-lg font-black text-slate-950">{formatChileTime(slot.start_at)}</span>
                    <span className="text-xs font-semibold text-slate-600">{slot.professional_name}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-slate-950">Datos del paciente</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombres" error={errors.firstNames}>
              <input className="form-field" value={patient.firstNames} onChange={(event) => updatePatient("firstNames", event.target.value)} />
            </Field>
            <Field label="Apellidos" error={errors.lastNames}>
              <input className="form-field" value={patient.lastNames} onChange={(event) => updatePatient("lastNames", event.target.value)} />
            </Field>
            <Field label="RUT" error={errors.rut}>
              <input
                className="form-field"
                value={patient.rut}
                onBlur={() => updatePatient("rut", normalizeRut(patient.rut))}
                onChange={(event) => updatePatient("rut", event.target.value)}
                placeholder="12.345.678-5"
              />
            </Field>
            <Field label="Correo electronico" error={errors.email}>
              <input className="form-field" type="email" value={patient.email} onChange={(event) => updatePatient("email", event.target.value)} />
            </Field>
            <Field label="Telefono" error={errors.phone}>
              <input
                className="form-field"
                value={patient.phone}
                onBlur={() => updatePatient("phone", normalizeChileanPhone(patient.phone))}
                onChange={(event) => updatePatient("phone", event.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </Field>
            <Field label="Fecha de nacimiento" error={errors.birthDate}>
              <input className="form-field" type="date" value={patient.birthDate} onChange={(event) => updatePatient("birthDate", event.target.value)} />
            </Field>
          </div>
          <Field label="Motivo general de consulta, opcional">
            <input className="form-field" value={patient.reason} onChange={(event) => updatePatient("reason", event.target.value)} />
          </Field>
          <Field label="Observaciones, opcional">
            <textarea className="form-field min-h-28" value={patient.notes} onChange={(event) => updatePatient("notes", event.target.value)} />
          </Field>
          <label className="hidden">
            Sitio web
            <input tabIndex={-1} autoComplete="off" value={patient.website} onChange={(event) => updatePatient("website", event.target.value)} />
          </label>
          <label className="flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-slate-700">
            <input
              className="mt-1 h-4 w-4"
              type="checkbox"
              checked={patient.acceptsPrivacy}
              onChange={(event) => updatePatient("acceptsPrivacy", event.target.checked)}
            />
            Acepto la politica de privacidad y el tratamiento de datos necesarios para gestionar esta reserva.
          </label>
          {errors.acceptsPrivacy ? <p className="text-sm font-semibold text-red-700">{errors.acceptsPrivacy}</p> : null}
        </section>
      ) : null}

      {step === 4 && selectedService && selectedSlot ? (
        <section className="grid gap-5">
          <h2 className="text-2xl font-black text-slate-950">Revisa y confirma</h2>
          <div className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm text-slate-700">
            <SummaryLine label="Servicio" value={selectedService.name} />
            <SummaryLine label="Profesional" value={selectedSlot.professional_name} />
            <SummaryLine label="Fecha" value={formatChileDateTime(selectedSlot.start_at)} />
            <SummaryLine label="Duracion" value={`${selectedService.duration_minutes} minutos`} />
            <SummaryLine label="Paciente" value={`${patient.firstNames} ${patient.lastNames}`} />
            <SummaryLine label="Correo" value={patient.email} />
            <SummaryLine label="Telefono" value={patient.phone} />
          </div>
          <button className="btn-primary w-full" type="button" disabled={submitting} onClick={submitBooking}>
            {submitting ? "Enviando solicitud..." : "Enviar solicitud a la clinica"}
          </button>
        </section>
      ) : null}

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-emerald-100 pt-5 sm:flex-row">
        <button className="btn-secondary" type="button" disabled={step === 0 || submitting} onClick={previousStep}>
          Volver
        </button>
        {step < 4 ? (
          <button className="btn-primary" type="button" disabled={catalogStatus !== "ready"} onClick={nextStep}>
            Continuar
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
      {error ? <span className="text-sm font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/70 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:justify-between">
      <span className="font-black text-slate-950">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}
