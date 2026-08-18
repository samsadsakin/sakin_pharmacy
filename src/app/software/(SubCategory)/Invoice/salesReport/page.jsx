"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FaFileInvoice,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


// ==============================
// MONEY
// ==============================

function money(value) {

  return Number(
    value || 0
  ).toLocaleString(
    "en-BD",
    {
      maximumFractionDigits: 2,
    }
  );

}


// ==============================
// PAGE
// ==============================

export default function SalesReportPage() {

  const [
    report,
    setReport,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    selectedMobile,
    setSelectedMobile,
  ] = useState("");


  // ==============================
  // LOAD REPORT
  // ==============================

  const loadReport =
    async (
      mobile = ""
    ) => {

      try {

        setLoading(true);

        setError("");


        const params =
          new URLSearchParams();


        if (mobile) {

          params.set(
            "sellerNumber",
            mobile
          );

        }


        const res =
          await fetch(
            `/api/software/invoices/sales-report?${params.toString()}`,
            {
              cache: "no-store",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to load report"
          );

        }


        setReport(
          data
        );


        setSelectedMobile(
          data.selectedSeller?.mobile ||
          ""
        );

      }
      catch (error) {

        console.error(
          "Sales Report Error:",
          error
        );


        setError(
          error.message ||
          "Failed to load report"
        );

      }
      finally {

        setLoading(false);

      }

    };


  // ==============================
  // FIRST LOAD
  // ==============================

  useEffect(() => {

    loadReport();

  }, []);


  // ==============================
  // SELECT STAFF
  // ==============================

  const handleStaffChange =
    (e) => {

      const mobile =
        e.target.value;


      setSelectedMobile(
        mobile
      );


      loadReport(
        mobile
      );

    };


  return (

    <div className="space-y-4">


      {/* ==============================
          HEADER
      ============================== */}

      <div className="rounded-xl bg-white p-4 shadow-sm">


        <h1 className="text-center text-xl font-semibold text-sky-700">

          Sales Report

        </h1>


        {/* ==============================
            MANAGER / ADMIN SELECTOR
        ============================== */}

        {(
          report?.viewer?.role ===
            "manager" ||
          report?.viewer?.role ===
            "admin"
        ) && (

          <div className="mx-auto mt-4 max-w-md">


            <label className="mb-1 block text-xs font-medium text-slate-500">

              Select Staff

            </label>


            <select
              value={
                selectedMobile
              }
              onChange={
                handleStaffChange
              }
              className="select select-bordered w-full cursor-pointer"
            >


              {report?.staffOptions?.map(
                (staff) => (

                  <option
                    key={
                      staff.mobile
                    }
                    value={
                      staff.mobile
                    }
                  >

                    {staff.name}

                    {" - "}

                    {staff.mobile}

                    {" - "}

                    {staff.role}

                  </option>

                )
              )}


            </select>


          </div>

        )}


        {/* ==============================
            SELECTED PERSON
        ============================== */}

        {report?.selectedSeller && (

          <div className="mt-4 text-center">


            <p className="font-semibold text-slate-700">

              {
                report.selectedSeller.name
              }

            </p>


            <p className="text-xs text-slate-400">

              {
                report.selectedSeller.mobile
              }

              {" • "}

              <span className="capitalize">

                {
                  report.selectedSeller.role
                }

              </span>

            </p>


          </div>

        )}


      </div>


      {/* ==============================
          ERROR
      ============================== */}

      {error && (

        <div className="alert alert-error">

          {error}

        </div>

      )}


      {/* ==============================
          LOADING
      ============================== */}

      {loading ? (

        <div className="rounded-xl bg-white py-16 text-center shadow-sm">

          <span className="loading loading-spinner loading-md text-blue-600" />

        </div>

      ) : (

        <>


          {/* ==============================
              SUMMARY
          ============================== */}

          <div className="grid gap-3 sm:grid-cols-2">


            <SummaryCard
              title="Last 7 Days Invoices"
              value={
                report?.summary
                  ?.totalInvoices ||
                0
              }
              icon={
                FaFileInvoice
              }
            />


            <SummaryCard
              title="Last 7 Days Payable"
              value={`৳${money(
                report?.summary
                  ?.totalPayable
              )}`}
              icon={
                FaMoneyBillWave
              }
            />


          </div>


          {/* ==============================
              DATE RANGE
          ============================== */}

          <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">


            <p className="text-xs text-slate-400">

              Last 7 Days

            </p>


            <p className="mt-1 text-sm font-medium text-slate-700">

              {report?.week?.from}

              {" → "}

              {report?.week?.to}

            </p>


          </div>


          {/* ==============================
              CHART
          ============================== */}

          <div className="rounded-xl bg-white p-4 shadow-sm">


            <h2 className="font-semibold text-slate-700">

              Last 7 Days Sales

            </h2>


            <p className="mb-4 text-xs text-slate-400">

              {
                report?.selectedSeller
                  ?.name
              }

              {" • "}

              {
                report?.selectedSeller
                  ?.mobile
              }

            </p>


            <div className="h-72 w-full">


              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={
                    report?.weekChart ||
                    []
                  }
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >


                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="day"
                    tick={{
                      fontSize: 11,
                    }}
                  />


                  <YAxis
                    tick={{
                      fontSize: 10,
                    }}
                  />


                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />


                  <Bar
                    dataKey="totalPayable"
                    fill="#2563eb"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />


                </BarChart>

              </ResponsiveContainer>


            </div>


          </div>


          {/* ==============================
              DAILY TABLE
          ============================== */}

          <div className="rounded-xl bg-white p-4 shadow-sm">


            <h2 className="mb-3 font-semibold text-slate-700">

              Daily Report

            </h2>


            <div className="overflow-x-auto">


              <table className="table">


                <thead>

                  <tr className="bg-slate-50">


                    <th>

                      Day

                    </th>


                    <th>

                      Date

                    </th>


                    <th className="text-center">

                      Invoice

                    </th>


                    <th className="text-right">

                      Payable

                    </th>


                  </tr>

                </thead>


                <tbody>


                  {report?.weekChart?.map(
                    (day) => (

                      <tr
                        key={
                          day.date
                        }
                      >


                        <td className="font-medium">

                          {day.day}

                        </td>


                        <td>

                          {day.date}

                        </td>


                        <td className="text-center">

                          {
                            day.totalInvoices
                          }

                        </td>


                        <td className="text-right font-semibold text-emerald-700">

                          ৳
                          {
                            money(
                              day.totalPayable
                            )
                          }

                        </td>


                      </tr>

                    )
                  )}


                </tbody>


              </table>


            </div>


          </div>


        </>

      )}


    </div>

  );

}


// ==============================
// SUMMARY CARD
// ==============================

function SummaryCard({
  title,
  value,
  icon: Icon,
}) {

  return (

    <div className="rounded-xl bg-white p-4 shadow-sm">


      <div className="flex items-center gap-3">


        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

          <Icon />

        </div>


        <div>

          <p className="text-xs text-slate-400">

            {title}

          </p>


          <p className="text-xl font-bold text-slate-700">

            {value}

          </p>

        </div>


      </div>


    </div>

  );

}


// ==============================
// TOOLTIP
// ==============================

function CustomTooltip({
  active,
  payload,
}) {

  if (
    !active ||
    !payload?.length
  ) {

    return null;

  }


  const data =
    payload[0]?.payload;


  return (

    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">


      <p className="font-semibold text-slate-700">

        {data.day}

      </p>


      <p className="text-xs text-slate-400">

        {data.date}

      </p>


      <p className="mt-2 text-sm">

        Invoices:{" "}

        <strong>

          {
            data.totalInvoices
          }

        </strong>

      </p>


      <p className="text-sm">

        Payable:{" "}

        <strong className="text-emerald-700">

          ৳
          {
            money(
              data.totalPayable
            )
          }

        </strong>

      </p>


    </div>

  );

}