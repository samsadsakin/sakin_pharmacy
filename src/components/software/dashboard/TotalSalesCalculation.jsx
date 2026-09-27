"use client";

import { useEffect, useState } from "react";


// =========================
// MONEY
// =========================

function money(value) {
  return Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


// =========================
// COMPONENT
// =========================

export default function TotalSalesCalculation({
  selectedDate,
}) {
  const [staffSales, setStaffSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD ALL STAFF SALES
  // =========================

  useEffect(() => {

    const loadAllSales = async () => {

      try {

        setLoading(true);
        setError("");


        // =================================
        // FIRST GET BOTH REPORTS
        // =================================

        const [salesRes, directRes] =
          await Promise.all([

            fetch(
              `/api/software/invoices/sales-report?date=${selectedDate}`,
              {
                cache: "no-store",
              }
            ),

            fetch(
              `/api/software/direct-sales/report?date=${selectedDate}`,
              {
                cache: "no-store",
              }
            ),

          ]);


        const salesData =
          await salesRes.json();

        const directData =
          await directRes.json();


        if (!salesRes.ok) {
          throw new Error(
            salesData?.message ||
              "Sales Report load failed"
          );
        }


        if (!directRes.ok) {
          throw new Error(
            directData?.message ||
              "Direct Sales load failed"
          );
        }


        // =================================
        // GET STAFF LIST
        // =================================

        const salesStaff =
          salesData?.staffOptions || [];

        const directStaff =
          directData?.staffOptions || [];


        // =================================
        // COMBINE STAFF
        // =================================

        const staffMap = new Map();


        salesStaff.forEach((staff) => {

          if (!staff?.mobile) return;

          staffMap.set(
            String(staff.mobile),
            {
              name:
                staff.name ||
                staff.mobile,

              mobile:
                String(staff.mobile),

              salesReport: 0,

              directSales: 0,

            }
          );

        });


        directStaff.forEach((staff) => {

          if (!staff?.mobile) return;

          const mobile =
            String(staff.mobile);


          if (!staffMap.has(mobile)) {

            staffMap.set(
              mobile,
              {
                name:
                  staff.name ||
                  staff.mobile,

                mobile,

                salesReport: 0,

                directSales: 0,

              }
            );

          }

        });


        // =================================
        // STAFF ARRAY
        // =================================

        const staffList =
          Array.from(
            staffMap.values()
          );


        // =================================
        // GET EACH STAFF SALES
        // =================================

        const calculatedStaff =
          await Promise.all(

            staffList.map(
              async (staff) => {

                let salesReport = 0;
                let directSales = 0;


                // =========================
                // SALES REPORT
                // =========================

                try {

                  const params =
                    new URLSearchParams();

                  params.set(
                    "date",
                    selectedDate
                  );

                  params.set(
                    "sellerNumber",
                    staff.mobile
                  );


                  const res =
                    await fetch(
                      `/api/software/invoices/sales-report?${params.toString()}`,
                      {
                        cache: "no-store",
                      }
                    );


                  if (res.ok) {

                    const data =
                      await res.json();


                    salesReport =
                      Number(
                        data?.summary
                          ?.totalPayable || 0
                      );

                  }

                } catch (error) {

                  console.error(
                    "Sales Report Error:",
                    staff.mobile,
                    error
                  );

                }


                // =========================
                // DIRECT SALES
                // =========================

                try {

                  const params =
                    new URLSearchParams();

                  params.set(
                    "date",
                    selectedDate
                  );

                  params.set(
                    "salesmanNumber",
                    staff.mobile
                  );


                  const res =
                    await fetch(
                      `/api/software/direct-sales/report?${params.toString()}`,
                      {
                        cache: "no-store",
                      }
                    );


                  if (res.ok) {

                    const data =
                      await res.json();


                    directSales =
                      Number(
                        data?.summary
                          ?.totalAmount || 0
                      );

                  }

                } catch (error) {

                  console.error(
                    "Direct Sales Error:",
                    staff.mobile,
                    error
                  );

                }


                // =========================
                // COMBINED
                // =========================

                const combined =
                  salesReport +
                  directSales;


                return {

                  ...staff,

                  salesReport,

                  directSales,

                  combined,

                };

              }
            )

          );


        // =================================
        // REMOVE ZERO STAFF
        // =================================

        const filteredStaff =
          calculatedStaff.filter(
            (staff) =>
              Number(
                staff.combined
              ) > 0
          );


        // =================================
        // TOTAL
        // =================================

        const grandTotal =
          filteredStaff.reduce(
            (sum, staff) =>
              sum +
              Number(
                staff.combined || 0
              ),
            0
          );


        setStaffSales(
          filteredStaff
        );

        setTotalSales(
          grandTotal
        );

      } catch (error) {

        console.error(
          "Total Sales Calculation Error:",
          error
        );

        setError(
          error.message ||
            "Calculation failed"
        );

        setStaffSales([]);
        setTotalSales(0);

      } finally {

        setLoading(false);

      }

    };


    if (selectedDate) {
      loadAllSales();
    }

  }, [selectedDate]);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

        <div className="flex items-center justify-between">

          <h2 className="text-sm font-semibold text-slate-700">
            মোট বিক্রয়
          </h2>

          <span className="loading loading-spinner loading-sm text-sky-600" />

        </div>

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">

        <p className="text-sm font-semibold text-red-600">
          মোট বিক্রয়
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>

      </div>
    );

  }


  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">

      {/* HEADER */}

      <div className="mb-3 flex items-center justify-between">

        <div>

          <h2 className="text-sm font-semibold text-slate-700">
            মোট বিক্রয়
          </h2>

          <p className="text-[11px] text-slate-400">
            Sales + Direct Sales
          </p>

        </div>


        <div className="text-right">

          <p className="text-[10px] text-slate-400">
            সর্বমোট
          </p>

          <p className="text-base font-bold text-emerald-700">
            ৳ {money(totalSales)}
          </p>

        </div>

      </div>


      {/* STAFF LIST */}

      {staffSales.length > 0 ? (

        <div className="divide-y divide-slate-100">

          {staffSales.map((staff) => (

            <div
              key={staff.mobile}
              className="flex items-center justify-between gap-2 py-2"
            >

              {/* STAFF */}

              <div className="min-w-0">

                <p className="truncate text-xs font-medium text-slate-700">
                  {staff.name}
                </p>

                <p className="text-[10px] text-slate-400">
                  {staff.mobile}
                </p>

              </div>


              {/* AMOUNT */}

              <div className="shrink-0 text-right">

                <p className="text-sm font-semibold text-slate-700">
                  ৳ {money(staff.combined)}
                </p>

                <p className="text-[9px] text-slate-400">
                  Sales ৳ {money(staff.salesReport)}
                  {" + "}
                  Direct ৳ {money(staff.directSales)}
                </p>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="py-4 text-center">

          <p className="text-xs text-slate-400">
            কোনো বিক্রয় পাওয়া যায়নি
          </p>

        </div>

      )}


      {/* TOTAL */}

      {staffSales.length > 0 && (

        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">

          <p className="text-xs font-semibold text-slate-700">
            মোট বিক্রয়
          </p>

          <p className="text-base font-bold text-emerald-700">
            ৳ {money(totalSales)}
          </p>

        </div>

      )}

    </div>
  );
}