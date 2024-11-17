import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Elanji Minyya",
  description: "El calendario de los ndoweye",
};

import { Lexend_Deca } from 'next/font/google'

const lexendDeca = Lexend_Deca({ 
  subsets: ['latin'],
  variable: '--font-lexend-deca',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} font-sans antialiased bg-[#ECECF0] min-h-screen`}
      >
        <div className="custom:px-[5%] max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
