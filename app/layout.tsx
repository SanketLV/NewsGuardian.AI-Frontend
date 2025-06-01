import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const merriWeather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "NewsGuardian.AI - Uncover Bias & Misinformation in News",
  description:
    "NewsGuardian.AI is an AI-powered web app that detects bias, misinformation, and manipulative language in news articles to help users make informed decisions.",
  keywords: [
    "NewsGuardian.AI",
    "news bias detector",
    "AI news analyzer",
    "misinformation detection",
    "fact-checking tool",
    "media literacy",
    "fake news filter",
    "news truth AI",
    "political bias checker",
    "news credibility checker",
  ],
  authors: [{ name: "Sanket Lakhani", url: "https://sanket.is-a.dev" }],
  creator: "NewsGuardian.AI",
  // themeColor: "#0f172a", // or your primary brand color
  openGraph: {
    title: "NewsGuardian.AI",
    description:
      "Cut through the noise. Detect news bias, misinformation, and propaganda with AI.",
    url: "https://newsguardian.ai", // your deployed domain
    siteName: "NewsGuardian.AI",
    images: [
      {
        url: "https://newsguardian.ai/og-image.png", // customize this
        width: 1200,
        height: 630,
        alt: "NewsGuardian.AI Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsGuardian.AI",
    description:
      "Cut through the noise. Detect news bias, misinformation, and propaganda with AI.",
    site: "@yourhandle", // optional
    creator: "@yourhandle", // optional
    images: ["https://newsguardian.ai/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriWeather.variable} antialiased`}>
        <Header />
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  );
}
