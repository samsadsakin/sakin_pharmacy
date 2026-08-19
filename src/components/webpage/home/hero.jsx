import Link from "next/link";

import {
  FaCapsules,
  FaComments,
  FaShieldAlt,
  FaTags,
  FaUserCheck,
  FaArrowRight,
} from "react-icons/fa";


export default function PharmacyHero() {

  return (

    <section className="overflow-hidden bg-white">


      {/* =========================
          HERO
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:py-20">


        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">


          {/* =========================
              LEFT
          ========================= */}

          <div className="text-center lg:text-left">


            {/* BADGE */}

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">

              <FaShieldAlt className="text-xs" />

              Trusted Healthcare Partner

            </div>


            {/* TITLE */}

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-800 sm:text-5xl lg:text-6xl">

              Sakin Pharmacy

              <span className="mt-2 block text-[#08781F]">

                Your Health,
                <br className="hidden sm:block" />
                Our Care

              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8 lg:mx-0">

              Reliable pharmacy services, quality medicines and
              healthcare products to support your everyday health needs
              with care and convenience.

            </p>


            {/* =========================
                BUTTONS
            ========================= */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">


              {/* MEDICINE */}

              <Link
                href="/viewOurMedicine"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#08781F] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#066617]"
              >

                <FaCapsules />

                Explore Medicines

                <FaArrowRight className="text-xs" />

              </Link>


              {/* CONTACT */}

              <Link
                href="/sendUsMessage"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-[#08781F]"
              >

                <FaComments className="text-[#08781F]" />

                Send Us a Message

              </Link>


            </div>


            {/* =========================
                TRUST POINTS
            ========================= */}

            <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg lg:max-w-xl">


              <TrustItem
                title="Wide"
                text="Medicine Range"
              />


              <TrustItem
                title="Trusted"
                text="Products"
              />


              <TrustItem
                title="Fair"
                text="Pricing"
              />


            </div>


          </div>


          {/* =========================
              RIGHT IMAGE
          ========================= */}

          <div className="flex justify-center lg:justify-end">


            <div className="relative w-full max-w-lg">


              {/* SOFT BACKGROUND */}

              <div className="absolute bottom-4 left-4 right-0 top-4 rounded-3xl bg-emerald-50" />


              {/* IMAGE */}

              <div className="relative overflow-hidden rounded-3xl bg-white p-2 shadow-xl">


                <img
                  src="/images/pharmacy.jpg"
                  alt="Sakin Pharmacy"
                  className="h-auto w-full rounded-2xl object-cover"
                />


              </div>


              {/* =========================
                  FLOATING CARD
              ========================= */}

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-lg sm:bottom-6 sm:left-6 sm:right-auto sm:w-64">


                <div className="flex items-center gap-3">


                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#08781F]">

                    <FaShieldAlt />

                  </div>


                  <div>


                    <p className="text-xs font-medium text-slate-400">

                      Sakin Pharmacy

                    </p>


                    <p className="mt-1 text-sm font-bold text-slate-800">

                      Care You Can Trust

                    </p>


                  </div>


                </div>


              </div>


            </div>


          </div>


        </div>


        {/* =========================
            FEATURES
        ========================= */}

        <div className="mt-14 grid gap-4 sm:grid-cols-3 lg:mt-20">


          <InfoCard
            icon={FaShieldAlt}
            title="Trusted Medicines"
            text="Medicines and healthcare products sourced with quality and reliability in mind."
          />


          <InfoCard
            icon={FaTags}
            title="Fair Pricing"
            text="Healthcare essentials offered with clear and reasonable pricing for our customers."
          />


          <InfoCard
            icon={FaUserCheck}
            title="Friendly Service"
            text="Helpful and convenient pharmacy support whenever you need assistance."
          />


        </div>


      </div>


    </section>

  );

}


// =========================
// TRUST ITEM
// =========================

function TrustItem({
  title,
  text,
}) {

  return (

    <div className="rounded-2xl bg-slate-50 px-2 py-4 text-center lg:text-left">


      <p className="text-lg font-bold text-slate-800 sm:text-xl">

        {title}

      </p>


      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">

        {text}

      </p>


    </div>

  );

}


// =========================
// INFO CARD
// =========================

function InfoCard({
  icon: Icon,
  title,
  text,
}) {

  return (

    <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-emerald-50 sm:p-6">


      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-[#08781F] shadow-sm">

        <Icon />

      </div>


      <h3 className="mt-4 text-lg font-bold text-slate-800">

        {title}

      </h3>


      <p className="mt-2 text-sm leading-6 text-slate-500">

        {text}

      </p>


    </div>

  );

}