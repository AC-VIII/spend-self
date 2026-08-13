import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "SpendSelf — Spend time on yourself.",
  description:
    "Immersive experiences for people who want to temporarily leave the digital world behind.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7882537711024244"
     crossOrigin="anonymous"></script>
     <meta name="google-adsense-account" content="ca-pub-7882537711024244"></meta>
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        </body>
    </html>
  );
}