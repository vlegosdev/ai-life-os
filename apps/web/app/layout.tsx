import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Life OS",
  description: "A calm place to capture what is on your mind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
