import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import "./dark-theme.css";

export const metadata: Metadata = {
  title: "Nusa CRM — Customer & Sales Workspace",
  description: "Workspace pelanggan, penjualan, dan layanan pelanggan.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><Script id="theme-init" strategy="beforeInteractive">{`try { if (localStorage.getItem("nusa-crm-dark") === "true") document.documentElement.classList.add("dark"); } catch {}`}</Script><body>{children}</body></html>;
}
