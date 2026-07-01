import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Patentes BR - Consulta de Propriedade Intelectual",
  description: "Consulte patentes, programas de computador e processos do INPI. Pesquise por termo, numero, titulo, depositante ou classificacao IPC.",
  keywords: "patentes, INPI, propriedade intelectual, marcas, patentes Brasil, IPC",
  authors: [{ name: "Patentes BR" }],
  openGraph: {
    title: "Patentes BR - Consulta de Propriedade Intelectual",
    description: "Consulte patentes, programas de computador e processos do INPI",
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