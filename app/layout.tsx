import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VilorAI",
  description: "Inteligência Artificial de Próxima Geração",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  );
}
