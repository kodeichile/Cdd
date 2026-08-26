export const CHILE_TIME_ZONE = "America/Santiago";

export const APPOINTMENT_STATUSES = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Atendida",
  no_show: "Paciente no asistio",
};

export function sanitizeText(value, maxLength = 160) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizeRut(value) {
  const clean = String(value ?? "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();

  if (clean.length < 2) {
    return "";
  }

  const body = clean.slice(0, -1).replace(/\D/g, "");
  const checkDigit = clean.slice(-1);

  if (!body || !/^[0-9K]$/.test(checkDigit)) {
    return "";
  }

  return `${body}-${checkDigit}`;
}

export function isValidRut(value) {
  const normalized = normalizeRut(value);
  if (!normalized) {
    return false;
  }

  const [body, checkDigit] = normalized.split("-");
  let multiplier = 2;
  let sum = 0;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expected = 11 - (sum % 11);
  const expectedDigit = expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  return expectedDigit === checkDigit;
}

export function normalizeChileanPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (digits.startsWith("56") && digits.length >= 11) {
    return `+${digits.slice(0, 11)}`;
  }

  if (digits.length === 9) {
    return `+56${digits}`;
  }

  if (digits.length === 8) {
    return `+562${digits}`;
  }

  return digits ? `+${digits}` : "";
}

export function isValidChileanPhone(value) {
  return /^\+56(9\d{8}|2\d{8}|[3-8]\d{8})$/.test(normalizeChileanPhone(value));
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());
}

export function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  const startA = new Date(aStart).getTime();
  const endA = new Date(aEnd).getTime();
  const startB = new Date(bStart).getTime();
  const endB = new Date(bEnd).getTime();

  return startA < endB && startB < endA;
}

export function hasAppointmentOverlap(candidate, appointments) {
  return appointments.some((appointment) => {
    if (appointment.status === "cancelled") {
      return false;
    }

    return intervalsOverlap(
      candidate.startAt,
      candidate.endAt,
      appointment.startAt ?? appointment.start_at,
      appointment.endAt ?? appointment.end_at,
    );
  });
}

export function validatePatientPayload(payload) {
  const errors = {};
  const firstNames = sanitizeText(payload.firstNames, 80);
  const lastNames = sanitizeText(payload.lastNames, 80);
  const rut = normalizeRut(payload.rut);
  const email = sanitizeText(payload.email, 120).toLowerCase();
  const phone = normalizeChileanPhone(payload.phone);
  const birthDate = sanitizeText(payload.birthDate, 10);

  if (!firstNames) {
    errors.firstNames = "Ingresa tus nombres.";
  }

  if (!lastNames) {
    errors.lastNames = "Ingresa tus apellidos.";
  }

  if (!isValidRut(rut)) {
    errors.rut = "Ingresa un RUT valido, con digito verificador correcto.";
  }

  if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo valido.";
  }

  if (!isValidChileanPhone(phone)) {
    errors.phone = "Ingresa un telefono chileno valido.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    errors.birthDate = "Ingresa tu fecha de nacimiento.";
  }

  if (!payload.acceptsPrivacy) {
    errors.acceptsPrivacy = "Debes aceptar la politica de privacidad y tratamiento de datos.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    patient: {
      firstNames,
      lastNames,
      rut,
      email,
      phone,
      birthDate,
      reason: sanitizeText(payload.reason, 260),
      notes: sanitizeText(payload.notes, 500),
    },
  };
}

export function formatChileDateTime(value, options = {}) {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: CHILE_TIME_ZONE,
    dateStyle: options.dateStyle ?? "full",
    timeStyle: options.timeStyle ?? "short",
  }).format(new Date(value));
}

export function formatChileDate(value) {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: CHILE_TIME_ZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${value}T12:00:00`));
}

export function formatChileTime(value) {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: CHILE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function toCsvValue(value) {
  const text = String(value ?? "");
  return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
