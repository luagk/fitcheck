import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "fitcheck", description: "Compare your resume with a job description." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}