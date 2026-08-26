import Link from "next/link";

const navItems = [
  ["Inicio", "/"],
  ["Servicios", "/servicios"],
  ["Equipo", "/equipo"],
  ["Nuestra clinica", "/nuestra-clinica"],
  ["Contacto", "/contacto"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/94 shadow-[0_14px_34px_rgba(47,143,91,0.10)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio">
          <BrandLogo compact />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-emerald-900 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-emerald-700">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:+56933844001" className="text-sm font-semibold text-emerald-900">
            +56 9 3384 4001
          </a>
          <Link href="/agenda" className="btn-primary">
            Agenda tu hora
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/agenda" className="btn-primary px-4 py-2 text-sm">
            Agendar
          </Link>
          <details className="relative">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-emerald-200 text-emerald-900">
              <span className="sr-only">Abrir menu</span>
              <span className="text-xl leading-none">=</span>
            </summary>
            <nav className="absolute right-0 mt-3 grid min-w-52 gap-1 rounded-xl border border-emerald-100 bg-white p-2 shadow-xl">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-lg px-4 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#174d35] text-white">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-9 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <BrandLogo />
          </div>
          <p className="text-sm leading-6 text-emerald-100">
            Atencion dental integral con tecnologia moderna, criterio clinico y trato cercano.
          </p>
          <div className="mt-5 flex gap-3">
            <a className="social-icon" href="https://instagram.com" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" />
              </svg>
            </a>
            <a className="social-icon" href="https://facebook.com" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h2V5h-2c-2.8 0-4.5 1.7-4.5 4.4V12H7v3h2.5v5H13v-5h2.6l.4-3h-3V9.5c0-.9.4-1.5 1-1.5Z" />
              </svg>
            </a>
            <a className="social-icon" href="https://wa.me/56933844001" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4a7.7 7.7 0 0 0-6.7 11.5L4.5 20l4.6-1.2A7.7 7.7 0 1 0 12 4Z" />
                <path d="M9.4 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.8c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4 0 .7.4.7 1 1.4 1.7 1.8.3.2.5.2.7 0l.6-.6c.2-.2.4-.2.7-.1l1.7.8c.4.2.5.4.5.7 0 .8-.7 1.8-1.6 1.9-1.3.2-3-.5-4.6-2-1.6-1.5-2.7-3.4-2.8-4.8 0-.5.2-1.2.5-1.5Z" />
              </svg>
            </a>
          </div>
        </div>
        <FooterList title="Navegacion" items={navItems} />
        <FooterList
          title="Servicios"
          items={[
            ["Ortodoncia", "/servicios/ortodoncia"],
            ["Implantes", "/servicios/implantes-dentales"],
            ["Blanqueamiento", "/servicios/blanqueamiento-dental"],
            ["Odontologia general", "/servicios/odontologia-general"],
          ]}
        />
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">Contacto</h2>
          <p className="text-sm leading-7 text-emerald-100">
            Strip Center Paseo Alcorta segundo piso
            <br />
            +56 9 3384 4001
            <br />
            hola@centromedicodental.cl
            <br />
            Lun a Vie 9:00-19:00
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-emerald-100">
        © 2026 Denticlass Consulta Dental. Todos los derechos reservados.
      </div>
    </footer>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-logo ${compact ? "brand-logo-compact" : ""}`}>
      <img
        className="brand-logo-icon"
        src="/denticlass-tooth-icon.png"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-logo-text" aria-label="Denticlass Clinica Dental">
        <span className="brand-logo-name">Denticlass</span>
        <span className="brand-logo-subtitle">CLINICA DENTAL</span>
      </span>
    </span>
  );
}

function FooterList({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">{title}</h2>
      <div className="grid gap-3 text-sm text-emerald-100">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=56933844001"
      className="emergency-whatsapp fixed bottom-5 right-5 z-50 rounded-full bg-[#d7334f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91f38]"
      aria-label="Urgencias 24 horas - Escribenos"
    >
      Urgencias 24 horas
    </a>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
