import Link from "next/link";
import {
  FaCapsules,
  FaComments,
  FaShieldAlt,
  FaTags,
  FaUserCheck,
  FaArrowRight,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaSyringe,
  FaHandHoldingHeart,
  FaCheckCircle,
} from "react-icons/fa";

export default function PharmacyHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white py-10 sm:py-16 lg:py-24">
      
      {/* BACKGROUND ANIMATED GLOW ORBS */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================
            HERO MAIN SECTION
        ========================= */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="text-center lg:col-span-7 lg:text-left">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-100/80 px-4 py-2 text-xs font-extrabold text-emerald-900 shadow-sm backdrop-blur-md sm:text-sm">
              <FaShieldAlt className="text-emerald-700 animate-pulse" />
              <span>Government Registered & Hospital Adjacent Pharmacy</span>
            </div>

            {/* TITLE */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              Sakin Pharmacy
              <span className="mt-2 block bg-gradient-to-r from-[#08781F] via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Complete Healthcare & Surgical Care
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8 lg:mx-0">
              Your trusted 24/7 destination for 100% authentic medicines, critical <span className="font-bold text-slate-800">Cancer Care Drugs</span>, <span className="font-bold text-slate-800">Surgical Supplies</span>, and <span className="font-bold text-[#08781F]">Somajseba (Social Welfare) Discounted Healthcare</span> right beside Shaheed Ziaur Rahman Medical College Hospital.
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              
              <Link
                href="/viewOurMedicine"
                className="group flex items-center justify-center gap-2.5 rounded-2xl bg-[#08781F] px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-700/25 transition-all duration-300 hover:bg-[#066617] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaCapsules className="text-xl transition-transform group-hover:rotate-12" />
                <span>Explore Medicines</span>
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/ourShopLocation"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50/90 px-7 py-4 text-base font-bold text-[#08781F] shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-emerald-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaMapMarkerAlt className="text-xl text-[#08781F]" />
                <span>Our Location</span>
              </Link>

              <Link
                href="/sendUsMessage"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-base font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-300 hover:bg-slate-50 hover:text-[#08781F] hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaComments className="text-xl text-[#08781F]" />
                <span>Message Us</span>
              </Link>

            </div>

            {/* QUICK STATS & BADGES */}
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 lg:max-w-xl">
              <TrustItem title="100%" text="Authentic Meds" />
              <TrustItem title="Affordable" text="Somajseba Support" />
              <TrustItem title="Fast" text="24/7 Availability" />
            </div>

          </div>

          {/* RIGHT IMAGE CARD WITH GLASS EFFECT */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-3 shadow-[0_20px_50px_rgba(8,120,31,0.15)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_60px_rgba(8,120,31,0.22)]">
                
                <div className="overflow-hidden rounded-[2rem]">
                  <img
                    src="/images/pharmacy.jpg"
                    alt="Sakin Pharmacy"
                    className="h-[380px] sm:h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* FLOATING GLASS OVERLAY BADGE */}
                <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto">
                  <div className="flex items-center gap-3.5 rounded-2xl border border-white/90 bg-white/90 p-4 shadow-xl backdrop-blur-md transition hover:bg-white">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08781F] text-white shadow-md shadow-emerald-700/20">
                      <FaShieldAlt className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                        Sakin Pharmacy
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-800">
                        Care You Can Trust
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* =========================
            SPECIALIZED SERVICES & HIGHLIGHTS
        ========================= */}
        <div className="mt-16 sm:mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
              Specialized Medical Services & Products
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Providing specialized treatments and discounts at fair prices
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            <ServiceCard
              icon={FaHeartbeat}
              title="Cancer Medicine"
              text="Specialized oncology and life-saving cancer treatment drugs available at competitive prices."
              color="text-rose-600 bg-rose-50"
            />

            <ServiceCard
              icon={FaHandHoldingHeart}
              title="Somajseba Support"
              text="Special discounts for underprivileged patients through Social Welfare (সমাজসেবা) support."
              color="text-emerald-700 bg-emerald-50"
            />

            <ServiceCard
              icon={FaSyringe}
              title="Surgical Equipment"
              text="Complete range of surgical tools, IV fluids, dressing supplies, and hospital equipment."
              color="text-blue-600 bg-blue-50"
            />

            <ServiceCard
              icon={FaTags}
              title="Fair & Fixed Rates"
              text="100% original medicines sold strictly according to fair government and MRP rates."
              color="text-amber-600 bg-amber-50"
            />

          </div>
        </div>

        {/* =========================
            FEATURES SUMMARY
        ========================= */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={FaShieldAlt}
            title="Authentic Sourcing"
            text="Directly sourced from top pharmaceutical companies with strict storage and temperature standards."
          />
          <InfoCard
            icon={FaCheckCircle}
            title="Expert Pharmacists"
            text="Guidance from certified personnel regarding dosage, administration, and storage instructions."
          />
          <InfoCard
            icon={FaUserCheck}
            title="Hospital Adjacent"
            text="Located right next to Shaheed Ziaur Rahman Medical College Hospital for quick emergency response."
          />
        </div>

      </div>
    </section>
  );
}

// =========================
// TRUST ITEM
// =========================
function TrustItem({ title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-3 sm:p-4 text-center backdrop-blur-sm shadow-xs transition hover:border-emerald-300 hover:bg-emerald-50/50">
      <p className="text-base font-extrabold text-[#08781F] sm:text-lg">
        {title}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-600">
        {text}
      </p>
    </div>
  );
}

// =========================
// SERVICE CARD
// =========================
function ServiceCard({ icon: Icon, title, text, color }) {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${color} transition-transform duration-300 group-hover:scale-110`}>
        <Icon />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-800">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
        {text}
      </p>
    </div>
  );
}

// =========================
// INFO CARD
// =========================
function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-lg sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-[#08781F] shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#08781F] group-hover:text-white">
        <Icon />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-800">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {text}
      </p>
    </div>
  );
}