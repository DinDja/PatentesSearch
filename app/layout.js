import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

export const metadata = {
  title: "Patentes BR",
  description: "Buscador de patentes com proxy Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}