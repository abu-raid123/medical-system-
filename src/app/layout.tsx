import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام الإجازات الطبية - Medical Leave System",
  description:
    "نظام إلكتروني لإنشاء وإدارة تقارير الإجازات المرضية - Electronic system for creating and managing sick leave reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
