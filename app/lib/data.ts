import professionals from "@/data/professionals.json";
import services from "@/data/services.json";
import testimonials from "@/data/testimonials.json";

export type Service = (typeof services)[number];

export { professionals, services, testimonials };

export const featuredServices = services.filter((service) => service.featured);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
