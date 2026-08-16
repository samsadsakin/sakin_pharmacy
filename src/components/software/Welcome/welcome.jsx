"use client";

import Link from "next/link";

import {
  FaCartPlus,
  FaFileInvoice,
  FaChartLine,
  FaCapsules,
  FaUsers,
  FaCog,
} from "react-icons/fa";


export default function WelcomeCard() {


  const links = [

    {
      name: "Create Invoice",
      href: "/software/Invoice/createInvoice",
      icon: FaCartPlus,
      color: "bg-blue-50 text-blue-700",
    },

    {
      name: "Invoices",
      href: "/software/Invoice/viewInvoice",
      icon: FaFileInvoice,
      color: "bg-green-50 text-green-700",
    },

    {
      name: "Sales Report",
      href: "/software/invoiceSales",
      icon: FaChartLine,
      color: "bg-purple-50 text-purple-700",
    },

    {
      name: "Medicine",
      href: "/software/medicine",
      icon: FaCapsules,
      color: "bg-orange-50 text-orange-700",
    },

    {
      name: "Customers",
      href: "/software/customers",
      icon: FaUsers,
      color: "bg-pink-50 text-pink-700",
    },

    {
      name: "Settings",
      href: "/software/settings",
      icon: FaCog,
      color: "bg-slate-100 text-slate-700",
    },

  ];



  return (

    <div className="mx-auto w-full max-w-5xl">


      {/* Welcome */}

      <div
        className="
    rounded-2xl
    p-6
    text-white
    shadow-lg
  "
        style={{
          background:
            "linear-gradient(90deg, #123B6D 0%, #20A44A 100%)",
        }}
      >

        <h1 className="text-2xl font-bold">
          Welcome to Sakin Pharmacy 👋
        </h1>


        <p className="mt-2 max-w-xl text-sm text-white/80">
          Manage your pharmacy easily with smart invoice,
          medicine management and sales tracking system.
        </p>


        <p className="mt-4 text-xs font-medium text-white/70">
          Fast • Simple • Secure Pharmacy Management
        </p>


      </div>



      {/* Quick Access */}

      <div className="mt-6">

        <h2 className="mb-3 text-sm font-bold text-slate-700">
          Quick Access
        </h2>


        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-6
          "
        >


          {
            links.map((item) => {


              const Icon = item.icon;


              return (

                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    p-4
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >


                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      ${item.color}
                    `}
                  >

                    <Icon className="text-lg" />

                  </div>



                  <span
                    className="
                      mt-3
                      text-center
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >

                    {item.name}

                  </span>


                </Link>

              );


            })
          }


        </div>


      </div>



    </div>

  );

}