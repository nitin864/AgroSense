import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriShield – Climate-Resilient Agriculture Monitoring System",
  description:
    "A smart platform that helps farmers adapt to climate change with real-time weather insights, crop recommendations, irrigation scheduling, and early risk alerts.",
  keywords: [
    "climate-resilient agriculture",
    "smart farming",
    "crop monitoring",
    "irrigation scheduling",
    "weather alerts",
    "AgriShield",
  ],
  openGraph: {
    title: "AgriShield – Climate-Resilient Agriculture Monitoring System",
    description:
      "Empowering Farmers with Climate Intelligence. Real-time insights, AI crop recommendations, early risk alerts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
