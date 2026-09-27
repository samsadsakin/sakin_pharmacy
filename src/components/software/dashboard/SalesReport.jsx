"use client";

import { useEffect, useState } from "react";

export default function SalesReport({ selectedDate }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState("");

  const loadReport = async (sellerNumber = selectedSeller) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (selectedDate) {
        params.append("date", selectedDate);
      }

      if (sellerNumber) {
        params.append("sellerNumber", sellerNumber);
      }

      const res = await fetch(
        `/api/software/invoices/sales-report?${params.toString()}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load sales report");
      }

      setReport(data);
    } catch (error) {
      console.error(error);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };


  // Load saved staff
  useEffect(() => {
    const savedStaff = localStorage.getItem("salesReportStaff");

    if (savedStaff) {
      setSelectedSeller(savedStaff);
      loadReport(savedStaff);
    } else {
      loadReport("");
    }
  }, [selectedDate]);


  // Staff change
  const handleStaffChange = (e) => {
    const value = e.target.value;

    setSelectedSeller(value);

    localStorage.setItem("salesReportStaff", value);

    loadReport(value);
  };


  const money = (value) => {
    return Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  const totalInvoices =
    report?.summary?.totalInvoices ?? 0;

  const totalSales =
    report?.summary?.totalPayable ?? 0;


  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Sales Report
          </h2>

          <p className="text-xs text-slate-400">
            Sales summary for selected date
          </p>
        </div>


        {/* STAFF FILTER */}
        <div className="w-full sm:w-56">

          <label className="mb-1 block text-xs font-medium text-slate-600">
            Select Staff
          </label>

          <select
            value={selectedSeller}
            onChange={handleStaffChange}
            className="select select-sm select-bordered w-full"
          >

            <option value="">
              All Staff
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
            {loading ? "..." : totalInvoices}
          </p>

          <p className="mt-1 text-xs text-sky-500">
            Total Invoices
          </p>

        </div>


        {/* TOTAL SALES */}
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">

          <p className="text-xs font-medium text-emerald-600">
            Total Sales
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {loading ? "..." : `৳ ${money(totalSales)}`}
          </p>

          <p className="mt-1 text-xs text-emerald-500">
            Total Payable
          </p>

        </div>

      </div>


      {/* SELECTED STAFF */}
      {report?.selectedSeller && (
        <div className="mt-4 text-xs text-slate-500">

          Staff:{" "}

          <span className="font-medium text-slate-700">
            {report.selectedSeller.name}
          </span>

          {report.selectedSeller.mobile && (
            <span className="ml-1">
              ({report.selectedSeller.mobile})
            </span>
          )}

        </div>
      )}

    </div>
  );
}