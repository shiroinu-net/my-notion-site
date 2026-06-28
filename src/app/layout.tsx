import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import Header from "./components/header";
import RevealObserver from "./components/RevealObserver";
import Script from "next/script";

const WaterBackground = dynamic(() => import("./components/WaterBackground"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Rishao",
  description: "drawn to everything sound can touch — the named and the nameless alike. musician · sound artist · Nagoya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Sans+JP:wght@200;300;400&family=Noto+Serif+JP:wght@300;400&family=Space+Mono:ital,wght@0,400;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N41J60VR37"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N41J60VR37');
        `}</Script>
        <WaterBackground />
        <RevealObserver />
        <Header />
        {children}
      </body>
    </html>
  );
}
