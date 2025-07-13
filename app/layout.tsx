import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Job Tracking App",
  description:
    "Simple online job tracking application for helping users to track their job applications",
  keywords: [
    "job application tracker",
    "career management",
    "job search organizer",
    "employment tracker",
    "application status manager",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <main>
          <Providers>{children}</Providers>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
