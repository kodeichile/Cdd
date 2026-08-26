import type { Service } from "@/app/lib/data";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const image = "image" in service ? service.image : "/service-photo.png";

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="photo-frame service-card-photo">
        <img src={image} alt={`Atencion de ${service.title}`} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-3 inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-800">
          {service.category}
        </span>
        <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{service.description}</p>
        <p className="mt-4 text-sm font-bold text-emerald-800">{service.price}</p>
        <a href={`/servicios/${service.slug}`} className="mt-4 inline-flex font-bold text-[#2f8f5b]">
          Ver mas
        </a>
      </div>
    </article>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="page-hero">
      <div className="mx-auto max-w-5xl px-5 py-10 text-center">
        <p className="eyebrow">Denticlass Consulta Dental</p>
        <h1 className="text-balance text-4xl font-black text-slate-950 md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">{subtitle}</p>
      </div>
    </section>
  );
}
