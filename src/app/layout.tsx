import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Status Report · Centro Einstein de Inovação",
  description: "Acompanhamento semanal de projetos do Centro Einstein de Inovação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
