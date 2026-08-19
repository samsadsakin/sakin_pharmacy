"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  FaPlusCircle,
  FaList,
  FaChartLine,
  FaFileInvoice,
} from "react-icons/fa";


export default function DirectSaleNav() {

  const pathname =
    usePathname();


  // =========================
  // NAV ITEMS
  // =========================

  const items = [

    {
      name: "Add",
      href: "/software/DirectSale/Add",
      icon: FaPlusCircle,
    },

    {
      name: "View",
      href: "/software/DirectSale/ViewDirectSale",
      icon: FaList,
    },

    {
      name: "Report",
      href: "/software/DirectSale/directSalesReport",
      icon: FaChartLine,
    },

    {
      name: "Invoice",
      href: "/software/Invoice/createInvoice",
      icon: FaFileInvoice,
    },

  ];


  return (

    <div className="mt-5 flex justify-center">

      <div className="flex gap-1 rounded-xl bg-white p-1.5 shadow-sm">


        {items.map(
          ({
            name,
            href,
            icon: Icon,
          }) => {

            const active =
              pathname === href;


            return (

              <Link
                key={name}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition sm:gap-2 sm:px-4 sm:text-sm ${
                  active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >

                <Icon className="text-xs" />

                {name}

              </Link>

            );

          }
        )}


      </div>

    </div>

  );

}