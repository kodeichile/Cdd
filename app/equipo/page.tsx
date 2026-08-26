import { professionals } from "@/app/lib/data";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/Ui";

export const metadata = {
  title: "Equipo",
};

export default function TeamPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Conoce a nuestro equipo"
          subtitle="Profesionales certificados, comprometidos con tu salud dental."
        />
        <section className="bg-white pt-12">
          <div className="mx-auto max-w-7xl px-5">
            <div className="photo-frame team-banner">
              <img src="/team-photo.png" alt="Equipo profesional del centro medico dental" />
            </div>
          </div>
        </section>
        <section className="section">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((person, index) => (
              <article key={person.name} className="card p-6">
                <div className="photo-frame team-card-photo">
                  <img
                    src={"image" in person ? person.image : "/team-photo.png"}
                    alt={`Foto profesional de ${person.name}`}
                    style={{
                      objectPosition:
                        person.name === "Dra. Claudia Zapata"
                          ? "50% 28%"
                          : person.name === "Dra. Marialexis"
                            ? "50% 22%"
                            : `${[8, 24, 42, 58, 73, 90][index] ?? 50}% 42%`,
                    }}
                  />
                </div>
                <h2 className="text-xl font-black text-slate-950">{person.name}</h2>
                <p className="mt-2 font-bold text-emerald-800">{person.specialty}</p>
                <p className="mt-3 text-sm text-slate-600">{person.registration}</p>
                <p className="mt-1 text-sm text-slate-600">{person.experience}</p>
                <details className="mt-5 rounded-lg bg-emerald-50 p-4">
                  <summary className="cursor-pointer font-bold text-slate-950">Ver perfil</summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{person.education}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{person.bio}</p>
                </details>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
