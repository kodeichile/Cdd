import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Denticlass Consulta Dental",
    template: "%s | Denticlass Consulta Dental",
  },
  description:
    "Atencion dental integral, tecnologia moderna y un equipo profesional para cuidar tu sonrisa.",
  icons: {
    icon: "/consulta-dental-logo.png",
    shortcut: "/consulta-dental-logo.png",
  },
  openGraph: {
    title: "Denticlass Consulta Dental",
    description: "Tu sonrisa en las mejores manos.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
