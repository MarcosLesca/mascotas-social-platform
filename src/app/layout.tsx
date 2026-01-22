import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MascotasSanJusto - Encuentra tu mascota perdida en San Justo",
  description: "Plataforma gratuita para publicar mascotas perdidas, en adopción o solicitar donaciones en San Justo, Santa Fe. Conectamos a personas que aman los animales.",
  keywords: ["mascotas", "perdidas", "adopcion", "donaciones", "san justo", "santa fe", "perros", "gatos"],
  authors: [{ name: "MascotasSanJusto" }],
  openGraph: {
    title: "MascotasSanJusto - Encuentra a tu mascota",
    description: "Ayudamos a reunir mascotas perdidas con sus dueños y encontrarles un hogar amoroso en San Justo",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
