import { notFound } from "next/navigation";
import { getService, professionals, services } from "@/app/lib/data";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/Ui";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  return {
    title: service ? service.title : "Servicio",
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const image = "image" in service ? service.image : "/service-photo.png";

  return (
    <SiteShell>
      <main>
        <PageHero title={service.title} subtitle={service.description} />
        <section className="section">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[1fr_380px]">
            <article className="card p-6">
              <div className="photo-frame mb-8 service-detail-photo">
                <img src={image} alt={`Imagen ilustrativa de ${service.title}`} />
              </div>
              <p className="text-lg leading-8 text-slate-600">{service.longDescription}</p>

              <h2 className="mt-7 text-2xl font-black text-slate-950">Que incluye?</h2>
              <ul className="mt-5 grid gap-3">
                {service.includes.map((item) => (
                  <li key={item} className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-7 text-2xl font-black text-slate-950">Preguntas frecuentes</h2>
              <div className="mt-5 grid gap-3">
                {service.faq.map(([question, answer]) => (
                  <details key={question} className="rounded-lg border border-emerald-100 bg-white p-4">
                    <summary className="cursor-pointer font-bold text-slate-950">{question}</summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
                  </details>
                ))}
              </div>
            </article>

            <aside className="space-y-5">
              <div className="card p-6">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Precio referencial</p>
                <p className="mt-3 text-3xl font-black text-slate-950">{service.price}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Precio final segun diagnostico.</p>
                <a href="/agenda" className="btn-primary mt-6 w-full">
                  Agenda este servicio
                </a>
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-black text-slate-950">Profesionales</h2>
                <div className="mt-4 grid gap-3">
                  {professionals.slice(0, 3).map((person) => (
                    <div key={person.name} className="rounded-lg bg-emerald-50 p-4">
                      <p className="font-bold text-slate-950">{person.name}</p>
                      <p className="text-sm text-slate-600">{person.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
