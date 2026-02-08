import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VilorAI Quantum",
  description: "GOOD AI!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, background: '#020202', color: '#fff' }}>{children}</body>
    </html>
  );
}
