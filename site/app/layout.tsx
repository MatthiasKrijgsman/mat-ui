import * as React from "react";
import "./globals.css";
import { Nav } from "./_components/Nav";

export const metadata = {
  title: "mat-ui",
  description: "React component library showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-stone-900">
        <div className="flex flex-row">
          <Nav />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
