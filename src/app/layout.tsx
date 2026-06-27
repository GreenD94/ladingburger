import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] });
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
});
const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-playfair-display',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Saborea",
  description: "Las mejores hamburguesas de la ciudad",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${bebasNeue.variable} ${playfairDisplay.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
