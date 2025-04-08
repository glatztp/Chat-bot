import "./globals.css";
import type { Metadata } from "next";
import Logo from "../../public/Logo.png";

export const metadata: Metadata = {
  title: "Chat Bot",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href={Logo.src} />
      </head>
      <body className="font-syne">{children}</body>
    </html>
  );
}
