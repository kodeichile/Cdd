import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/Ui";

const mapUrl = "https://www.google.com/maps/search/?api=1&query=-37.4713442,-72.3550008";
const mapEmbedUrl = "https://www.google.com/maps?q=-37.4713442,-72.3550008&z=18&output=embed";

export const metadata = {
  title: "Contacto",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Contactanos"
          subtitle="Estamos para ayudarte. Escribenos por el medio que prefieras."
        />
        <section className="section">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.9fr_1.1fr]">
            <form className="card grid gap-4 p-5 md:p-6">
              <input className="form-field" placeholder="Nombre" />
              <input className="form-field" type="email" placeholder="Email" />
              <input className="form-field" placeholder="Telefono" />
              <textarea className="form-field min-h-36" placeholder="Mensaje" />
              <button className="btn-primary" type="button">Enviar</button>
            </form>
            <div className="grid gap-5">
              <div className="photo-frame contact-photo">
                <img src="/reception-photo.png" alt="Recepcion del centro medico dental" />
              </div>
              <div className="card p-6">
                <h2 className="text-2xl font-black text-slate-950">Informacion de contacto</h2>
                <div className="mt-5 grid gap-3 text-slate-600">
                  <p><strong className="text-slate-950">Direccion:</strong> Strip Center Paseo Alcorta segundo piso</p>
                  <p><strong className="text-slate-950">Telefono:</strong> +56 9 3384 4001</p>
                  <p><strong className="text-slate-950">Email:</strong> hola@centromedicodental.cl</p>
                  <p><strong className="text-slate-950">Horario:</strong> Lun a Vie 9:00-19:00, Sab 9:00-14:00</p>
                </div>
                <a href="https://wa.me/56933844001" className="btn-primary mt-6">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-[#174d35] text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.65fr_1.35fr]">
            <div className="rounded-lg border border-white/10 bg-white/6 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">Ubicacion</p>
              <h2 className="mt-3 text-2xl font-black text-white">Strip Center Paseo Alcorta segundo piso</h2>
              <p className="mt-4 text-sm leading-7 text-emerald-100">
                Encuentranos en el Strip Center Paseo Alcorta segundo piso. Abre el mapa para revisar la ruta exacta desde tu ubicacion.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={mapUrl} className="btn-primary" target="_blank" rel="noreferrer">
                  Abrir en Google Maps
                </a>
                <a href={`${mapUrl}&dir_action=navigate`} className="btn-secondary" target="_blank" rel="noreferrer">
                  Como llegar
                </a>
              </div>
            </div>
            <div className="footer-map-frame">
              <iframe
                src={mapEmbedUrl}
                title="Mapa de ubicacion Strip Center Paseo Alcorta segundo piso"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
