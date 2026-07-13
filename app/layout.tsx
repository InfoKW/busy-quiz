import type { Metadata } from "next";
import { Playfair_Display, Instrument_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Busy Test",
  description:
    "Are you productive or just addicted to busy? 12 quick questions. 3 minutes.",
  openGraph: {
    title: "The Busy Test",
    description:
      "Are you productive or just addicted to busy? 12 quick questions. 3 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
