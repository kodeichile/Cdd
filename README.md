# Denticlass Clinica Dental

Sitio web para Denticlass Clinica Dental con paginas publicas, servicios, equipo, contacto y flujo visual de agenda.

## Levantar Localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Variables

Copia `.env.example` como `.env.local` si necesitas configurar el envio de solicitudes:

```bash
SITE_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_CLINIC_APPOINTMENT_EMAIL=hola@centromedicodental.cl
NEXT_PUBLIC_APPOINTMENT_REQUEST_ENDPOINT=
```

Si no configuras `NEXT_PUBLIC_APPOINTMENT_REQUEST_ENDPOINT`, la agenda abre un correo prellenado para que la secretaria valide la hora.

## Futuro Flujo Google

Para conectar Google Calendar o Google Sheets, usa `NEXT_PUBLIC_APPOINTMENT_REQUEST_ENDPOINT` apuntando a un endpoint propio, por ejemplo Google Apps Script, que reciba la solicitud desde el formulario y la registre en Google.

## Rutas Principales

- `/`: inicio
- `/servicios`: servicios dentales
- `/equipo`: equipo profesional
- `/nuestra-clinica`: fotos de la clinica
- `/agenda`: solicitud visual de hora
- `/contacto`: datos de contacto y mapa

Las rutas internas antiguas `/admin`, `/reserva` y `/convenios` redirigen al inicio.
