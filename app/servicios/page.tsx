import { services } from "@/app/lib/data";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/Ui";
import { ServicesFilterGrid } from "@/app/servicios/ServicesFilterGrid";

export const metadata = {
  title: "Servicios",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Nuestros servicios"
          subtitle="Encuentra el tratamiento que necesitas. Todos nuestros procedimientos son realizados por profesionales certificados."
        />
        <section className="section">
          <ServicesFilterGrid services={services} />
        </section>
      </main>
    </SiteShell>
  );
}
