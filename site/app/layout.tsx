import * as React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/app/_components/Nav";

const inter = Inter({
  subsets: [ "latin" ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "mat-ui",
  description: "React component library showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ inter.variable }>
    <body className="min-h-screen bg-stone-100 dark:bg-stone-900 font-sans">
    <Nav/>
    { children }
    </body>
    </html>
  );
}
