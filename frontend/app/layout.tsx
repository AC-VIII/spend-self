import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendSelf — Spend time on yourself.",
  description:
    "Immersive experiences for people who want to temporarily leave the digital world behind.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}