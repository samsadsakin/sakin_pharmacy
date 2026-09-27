"use client";

import { useEffect, useState } from "react";

export default function DirectSales({ selectedDate }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMobile, setSelectedMobile] = useState("");


  const loadReport = async (mobile = selectedMobile) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      // COMMON DATE FILTER
      if (selectedDate) {
        params.append("date", selectedDate);
      }

      // STAFF FILTER
      if (mobile) {
        params.append("salesmanNumber", mobile);
      }

      const res = await fetch(
        `/api/software/direct-sales/report?${params.toString()}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to load direct sales report"
        );
      }

      setReport(data);

    } catch (error) {
      console.error(error);
      setReport(null);

    } finally {
      setLoading(false);
    }
  };


  // Load report whenever common date changes
  useEffect(() => {
    const savedStaff =
      localStorage.getItem("directSalesSalesman") || "";

    setSelectedMobile(savedStaff);

    loadReport(savedStaff);

  }, [selectedDate]);


  // Staff change
  const handleStaffChange = (e) => {
    const value = e.target.value;

    setSelectedMobile(value);

    localStorage.setItem(
      "directSalesSalesman",
      value
    );

    loadReport(value);
  };


  const money = (value) => {
    return Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  const totalCustomers =
    report?.summary?.totalCustomers ?? 0;

  const totalAmount =
    report?.summary?.totalAmount ?? 0;


  const isManagerOrAdmin =
    report?.viewer?.role === "manager" ||
    report?.viewer?.role === "admin";


  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Direct Sales
          </h2>

          <p className="text-xs text-slate-400">
            Direct sales summary for selected date
          </p>
        </div>


        {/* STAFF FILTER */}
        {isManagerOrAdmin && (
          <div className="w-full sm:w-56">

            <label className="mb-1 block text-xs font-medium text-slate-600">
              Select Salesman
            </label>

            <select
              value={selectedMobile}
              onChange={handleStaffChange}
              className="select select-sm select-bordered w-full"
            >

              <option value="">
                All Salesman
              </option>

              {report?.staffOptions?.map((staff) => (
                <option
                  key={staff.mobile}
                  value={staff.mobile}
                >
                  {staff.name} - {staff.mobile}
                </option>
              ))}

            </select>

          </div>
        )}

      </div>


      {/* DATE */}
      <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2">

        <p className="text-xs text-slate-500">
          Date:{" "}

          <span className="font-medium text-slate-700">
            {selectedDate || "All"}
          </span>
        </p>

      </div>


      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* CUSTOMER COUNT */}
        <div className="rounded-lg border border-sky-100 bg-sky-50 p-4">

          <p className="text-xs font-medium text-sky-600">
            Customer Count
          </p>

          <p className="mt-1 text-2xl font-bold text-sky-800">
            {loading ? "..." : totalCustomers}
          </p>

          <p className="mt-1 text-xs text-sky-500">
            Total Customers
          </p>

        </div>


        {/* TOTAL AMOUNT */}
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">

          <p className="text-xs font-medium text-emerald-600">
            Total Amount
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {loading
              ? "..."
              : `৳ ${money(totalAmount)}`}
          </p>

          <p className="mt-1 text-xs text-emerald-500">
            Direct Sales
          </p>

        </div>

      </div>


      {/* SELECTED SALESMAN */}
      {report?.selectedSalesman && (
        <div className="mt-4 text-xs text-slate-500">

          Salesman:{" "}

          <span className="font-medium text-slate-700">
            {report.selectedSalesman.name}
          </span>

          {report.selectedSalesman.mobile && (
            <span className="ml-1">
              ({report.selectedSalesman.mobile})
            </span>
          )}

        </div>
      )}

    </div>
  );
}