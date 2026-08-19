"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/webpage/Navbar";


export default function LayoutClient({
  children,
}) {

  const pathname =
    usePathname();


  const hideNavbar =
    pathname === "/software" ||
    pathname?.startsWith(
      "/software/"
    );


  return (
    <div>

      {!hideNavbar && (
        <Navbar />
      )}


      {children}


      <div className="border-t border-emerald-100 py-3 text-center text-xs text-slate-500">

        © 2026 Sakin Pharmacy. All Rights Reserved. | Developed by{" "}

        <Link
          href="https://www.linkedin.com/in/samsad-sakin-24a86a3a3/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-700"
        >
          Md.Samsad Sakin
        </Link>

      </div>

    </div>
  );
}