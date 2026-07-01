import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Songdio",
  description: "Songdio landing page — V2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
