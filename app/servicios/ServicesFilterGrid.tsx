"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/app/lib/data";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { ServiceCard } from "@/app/components/Ui";

const filters = ["Todos", "Ortodoncia", "Implantes", "Estetica", "Diagnostico", "Prevencion", "Ninos", "Urgencias"];

export function ServicesFilterGrid({ services }: { services: Service[] }) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const visibleServices = useMemo(() => {
    if (activeFilter === "Todos") {
      return services;
    }

    return services.filter((service) => service.category === activeFilter);
  }, [activeFilter, services]);

  return (
    <div className="mx-auto max-w-7xl px-5">
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar servicios">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-[#2f8f5b] bg-[#2f8f5b] text-white shadow-sm"
                  : "border-emerald-100 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100"
              }`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((service, index) => (
          <ScrollReveal key={`${activeFilter}-${service.slug}`} delay={index * 90}>
            <ServiceCard service={service} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
