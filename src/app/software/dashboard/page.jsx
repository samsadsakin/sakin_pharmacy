"use client";

import { useEffect, useState } from "react";

import SalesReport from "@/components/software/dashboard/SalesReport";
import TotalSalesCalculation from "@/components/software/dashboard/TotalSalesCalculation";
import DirectSales from "@/components/software/dashboard/DirectSales";
import SmsBalance from "@/components/software/dashboard/SmsBalance";


// =========================
// TODAY DATE
// =========================

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =========================
// DASHBOARD
// =========================

export default function Dashboard() {

  // =========================
  // DATE
  // =========================

  const [selectedDate, setSelectedDate] = useState(getToday());


  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);


  // =========================
  // GET CURRENT USER
  // =========================

  useEffect(() => {

    const getProfile = async () => {

      try {

        const res = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (
          res.ok &&
          data.loggedIn
        ) {

          setUser(data.user);

        } else {

          setUser(null);

        }

      } catch (error) {

        console.error(
          "Dashboard Profile Error:",
          error
        );

        setUser(null);

      } finally {

        setProfileLoading(false);

      }

    };


    getProfile();

  }, []);


  // =========================
  // ROLE CHECK
  // =========================

  const isAdminOrManager =
    user?.role === "admin" ||
    user?.role === "manager";


  // =========================
  // LOADING
  // =========================

  if (profileLoading) {

    return (

      <div className="min-h-screen bg-slate-50 p-4 md:p-6">

        <div className="mb-6 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-3 w-52 animate-pulse rounded bg-slate-100" />

        </div>


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="h-40 animate-pulse rounded-xl bg-white" />

          <div className="h-40 animate-pulse rounded-xl bg-white" />

        </div>

      </div>

    );

  }


  // =========================
  // PAGE
  // =========================

  return (

    <div className="min-h-screen bg-slate-50 p-4 md:p-6">


      {/* =========================
          COMMON DATE FILTER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">


        {/* TITLE */}

        <div>

          <h1 className="text-lg font-semibold text-slate-800">
            Dashboard
          </h1>

          <p className="text-xs text-slate-400">
            View reports by selected date
          </p>

        </div>


        {/* DATE */}

        <div>

          <label className="mb-1 block text-xs font-medium text-slate-600">
            Report Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="input input-sm input-bordered w-full sm:w-auto"
          />

        </div>

      </div>


      {/* =========================
          REPORTS
      ========================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


        {/* =========================
            ADMIN + MANAGER ONLY
        ========================= */}

        {isAdminOrManager && (

          <TotalSalesCalculation
            selectedDate={selectedDate}
          />

        )}


        {/* =========================
            ADMIN + MANAGER ONLY
        ========================= */}

        {isAdminOrManager && (

          <SmsBalance />

        )}


        {/* =========================
            ALL USERS
        ========================= */}

        <SalesReport
          selectedDate={selectedDate}
        />


        {/* =========================
            ALL USERS
        ========================= */}

        <DirectSales
          selectedDate={selectedDate}
        />


      </div>

    </div>

  );

}