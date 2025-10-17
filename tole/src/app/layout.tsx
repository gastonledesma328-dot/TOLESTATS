import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "LA REDONDA - Fútbol Argentino e Internacional",
  description: "Resultados, tablas, partidos en vivo y próximas fechas de fútbol argentino e internacional. Tu portal deportivo de confianza.",
  keywords: "futbol argentino, resultados futbol, tabla posiciones, partidos en vivo, liga profesional, copa libertadores",
  authors: [{ name: "LA REDONDA" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "LA REDONDA - Fútbol Argentino e Internacional",
    description: "Resultados, tablas, partidos en vivo y próximas fechas de fútbol argentino e internacional",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LA REDONDA - Fútbol Argentino e Internacional",
    description: "Tu portal deportivo de confianza",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={roboto.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${roboto.className} bg-gray-900 text-white antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
}