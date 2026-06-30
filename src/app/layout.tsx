import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel-X | Enterprise AI Drone & Robotic Security Surveillance",
  description:
    "Enterprise-grade AI Security Surveillance Platform for autonomous drones, robotic ground vehicles, CCTV, thermal cameras, and real-time threat detection.",
  keywords: ["drone surveillance", "AI detection", "security", "autonomous robots", "thermal vision"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
