import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "Patentes BR - Consulta de Propriedade Intelectual",
  description:
    "Consulte patentes, programas de computador e processos do INPI. Pesquise por termo, numero, titulo, depositante ou classificacao IPC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
