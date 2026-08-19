import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import LayoutClient from "@/components/LayoutClient";


const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });


const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });


// =====================================
// DEFAULT WEBSITE METADATA
// =====================================

export const metadata = {

  title:
    "Sakin Pharmacy",

  description:
    "Sakin Pharmacy",

  icons: {
    icon: "/images/logo2.jpg",
  },

};


export default function RootLayout({
  children,
}) {

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <LayoutClient>

          {children}

        </LayoutClient>

      </body>

    </html>

  );

}