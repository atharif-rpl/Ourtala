import type { Metadata } from "next";
import "./globals.css"; // Pastikan path css benar

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Panel Admin Ourtala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}