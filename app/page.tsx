import Link from "next/link";
import { featuredServices, testimonials } from "@/app/lib/data";
import { AnimatedStats } from "@/app/components/AnimatedStats";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { SectionHeader, ServiceCard } from "@/app/components/Ui";
import { SiteShell } from "@/app/components/SiteShell";

const trustStats = [
  { prefix: "+", value: 10, label: "Anos de experiencia" },
  { prefix: "+", value: 500, label: "Pacientes atendidos" },
  { value: 6, label: "Especialidades odontologicas" },
  { value: 100, suffix: "%", label: "Profesionales con registro sanitario vigente" },
];

const reasons = [
  ["Tecnologia de vanguardia", "Equipamiento moderno para diagnosticos precisos y tratamientos mas comodos."],
  ["Equipo certificado", "Profesionales con registro sanitario vigente y formacion continua."],
  ["Atencion personalizada", "Cada plan de tratamiento se adapta a tu necesidad y presupuesto."],
  ["Atencion clara", "Te explicamos cada alternativa para que elijas tu tratamiento con confianza."],
];

const testimonialCarousel = [...testimonials, ...testimonials, ...testimonials];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero-section">
          <div className="w-full px-5 py-10 lg:py-14">
            <div className="hero-copy max-w-xl">
              <p className="eyebrow">Clinica dental integral</p>
              <h1 className="max-w-lg text-left text-5xl font-black leading-[1.03] text-slate-950 md:text-6xl">
                Tu sonrisa en las mejores manos
              </h1>
              <p className="mt-6 max-w-xl text-left text-lg leading-8 text-slate-600">
                Atencion dental integral, con tecnologia moderna y un equipo profesional que se preocupa por ti.
                Agenda tu hora en minutos.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/agenda" className="btn-primary">
                  Agenda tu hora
                </Link>
                <a href="https://wa.me/56933844001" className="btn-secondary">
                  Escribenos por WhatsApp
                </a>
              </div>
              <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
                <span>+500 pacientes atendidos</span>
                <span>Profesionales certificados</span>
                <span>Atencion personalizada</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-band">
          <AnimatedStats stats={trustStats} />
        </section>

        <section className="section">
          <SectionHeader
            title="Nuestros servicios"
            subtitle="Soluciones dentales para cada necesidad, con atencion personalizada en cada etapa."
          />
          <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, index) => (
              <ScrollReveal key={service.slug} delay={index * 110}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link href="/servicios" className="btn-secondary">
              Ver todos los servicios
            </Link>
          </div>
        </section>

        <section className="section bg-[#eefcf4]">
          <SectionHeader title="Por que elegir Denticlass?" />
          <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map(([title, text], index) => (
              <ScrollReveal key={title} delay={index * 100}>
                <article className="liquid-card h-full rounded-lg border border-emerald-100 bg-white p-6">
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeader
            title="Lo que dicen nuestros pacientes"
            subtitle="La confianza de quienes ya vivieron la experiencia."
          />
          <div className="testimonial-carousel mx-auto max-w-7xl px-5">
            <div className="testimonial-track">
              {testimonialCarousel.map((item, index) => (
                <article key={`${item.name}-${index}`} className="card testimonial-card p-6">
                  <p className="text-sm font-black text-emerald-700">★★★★★</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">&ldquo;{item.text}&rdquo;</p>
                  <p className="mt-5 font-bold text-slate-950">{item.name}</p>
                  <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{item.service}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-slate-50">
          <SectionHeader
            title="Nuestra clinica"
            subtitle="Espacios pensados para recibirte con calma, tecnologia y una atencion cercana desde la llegada."
          />
          <div className="mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-4 md:grid-rows-[170px_170px]">
            <div className="photo-frame md:col-span-2 md:row-span-2">
              <img src="/clinic-front-real.jpeg" alt="Fachada de Denticlass Consulta Dental" />
            </div>
            <div className="photo-frame">
              <img src="/clinic-reception-real.jpeg" alt="Recepcion de Denticlass" />
            </div>
            <div className="photo-frame">
              <img src="/clinic-box-real.jpeg" alt="Box dental equipado de Denticlass" />
            </div>
            <div className="photo-frame md:col-span-2">
              <img src="/clinic-waiting-real-1.jpeg" alt="Sala de espera de Denticlass" />
            </div>
          </div>
          <div className="mt-7 text-center">
            <Link href="/nuestra-clinica" className="btn-secondary">Conocer la clinica</Link>
          </div>
        </section>

        <section className="section bg-[#eefcf4]">
          <div className="visit-grid mx-auto grid max-w-7xl gap-6 px-5">
            <div className="photo-frame location-photo">
              <img src="/reception-photo.png" alt="Recepcion del centro medico dental" />
            </div>
            <div className="visit-card liquid-card rounded-lg bg-white p-6 shadow-sm">
              <p className="eyebrow">Ubicacion</p>
              <h2 className="section-title text-left">Visitanos</h2>
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
