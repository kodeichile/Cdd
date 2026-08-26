import Link from "next/link";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero, SectionHeader } from "@/app/components/Ui";

const clinicPhotos = [
  {
    src: "/clinic-box-real.jpeg",
    alt: "Box dental equipado de Denticlass",
    className: "clinic-photo-tall md:col-span-2 md:row-span-3",
  },
  {
    src: "/clinic-waiting-real-1.jpeg",
    alt: "Sala de espera de Denticlass",
    className: "clinic-photo-tall md:col-span-2 md:row-span-2",
  },
  {
    src: "/clinic-reception-real.jpeg",
    alt: "Recepcion de Denticlass",
    className: "clinic-photo-tall md:col-span-2 md:row-span-2",
  },
  {
    src: "/clinic-front-real.jpeg",
    alt: "Fachada de Denticlass Consulta Dental",
    className: "clinic-photo-tall md:col-span-2 md:row-span-2",
  },
];

const features = [
  ["Recepcion cercana", "Un primer contacto claro para orientar tu hora y resolver dudas antes de entrar a box."],
  ["Boxes preparados", "Espacios clinicos pensados para trabajar con orden, higiene y comodidad."],
  ["Equipo coordinado", "Profesionales y secretaria alineados para que la atencion sea simple de seguir."],
];

export const metadata = {
  title: "Nuestra clinica",
};

export default function NuestraClinicaPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Nuestra clinica"
          subtitle="Un espacio dental cercano, ordenado y pensado para que cada visita se sienta clara desde el primer momento."
        />
        <section className="section">
          <SectionHeader
            title="Conoce Denticlass por dentro"
            subtitle="Un vistazo a los espacios, el equipo y el ambiente donde atendemos a nuestros pacientes."
          />
          <div className="clinic-collage mx-auto grid max-w-7xl gap-4 px-5">
            {clinicPhotos.map((photo) => (
              <div key={photo.src} className={`photo-frame clinic-collage-photo ${photo.className}`}>
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        </section>

        <section className="section bg-[#eefcf4]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">Experiencia Denticlass</p>
              <h2 className="section-title">Una clinica pensada para atender con calma</h2>
              <p className="section-subtitle">
                Nuestro foco es que el paciente entienda su tratamiento, sepa que viene despues y tenga canales claros para agendar o consultar.
              </p>
              <Link href="/agenda" className="btn-primary mt-7">
                Agendar una hora
              </Link>
            </div>
            <div className="grid gap-4">
              {features.map(([title, text]) => (
                <article key={title} className="card p-6">
                  <h3 className="text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
