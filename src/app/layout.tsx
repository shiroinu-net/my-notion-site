import type { Metadata } from "next";
import "./globals.css";
import WaterBackground from "./components/WaterBackground";
import Header from "./components/header";
import RevealObserver from "./components/RevealObserver";

export const metadata: Metadata = {
  title: "Rishao",
  description: "a love for nameless phenomena, sung in cool, drifting electro-pop.",
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
        <WaterBackground />
        <RevealObserver />
        <Header />
        {children}
      </body>
    </html>
  );
}
