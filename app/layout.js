import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "SectiSeach - Sistema de Consulta de Propriedade Intelectual",
  description: "Sistema  de pesquisa de patentes brasileiras para engenheiros, advogados e pesquisadores.",
  keywords: "patentes, INPI, propriedade intelectual, marcas, patentes Brasil, IPC",
  authors: [{ name: "Sistema de Patentes" }],
  openGraph: {
    title: "SectiSeach - Sistema de Consulta de Propriedade Intelectual",
    description: "Sistema  de pesquisa de patentes brasileiras",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}