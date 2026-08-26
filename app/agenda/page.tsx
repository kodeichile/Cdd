import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/Ui";
import { AgendaForm } from "./AgendaForm";

export const metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Agenda tu hora"
          subtitle="Selecciona tratamiento, profesional y horario disponible con confirmacion inmediata."
        />
        <section className="section bg-slate-50">
          <div className="mx-auto max-w-7xl px-5">
            <div className="card min-w-0 p-5 md:p-6">
              <AgendaForm />
            </div>
          </div>
        </section>

        <section className="section bg-[#eefcf4]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-2">
            <div className="photo-frame location-photo">
              <img src="/reception-photo.png" alt="Recepcion de Denticlass Consulta Dental" />
            </div>
            <div className="liquid-card rounded-lg bg-white p-6 shadow-sm">
              <p className="eyebrow">Ubicacion</p>
              <h2 className="section-title text-left">¿Prefieres llamarnos?</h2>
              <div className="mt-5 grid gap-3 text-slate-600">
                <p><strong className="text-slate-950">Direccion:</strong> Strip Center Paseo Alcorta segundo piso</p>
                <p><strong className="text-slate-950">Telefono:</strong> +56 9 3384 4001</p>
                <p><strong className="text-slate-950">Horario:</strong> Lunes a Viernes 9:00-19:00, Sabado 9:00-14:00</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href="https://www.google.com/maps/search/?api=1&query=-37.4713442,-72.3550008" className="btn-secondary" target="_blank" rel="noreferrer">Como llegar</a>
                <a href="https://wa.me/56933844001" className="btn-primary">Escribenos</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
