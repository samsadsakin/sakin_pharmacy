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

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");


  // =========================
  // LOAD REPORT
  // =========================

  const loadReport =
    async ({
      mobile = selectedMobile,
      date = selectedDate,
    } = {}) => {

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


        if (date) {

          params.set(
            "date",
            date
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


        setReport(data);


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


  // =========================
  // FIRST LOAD
  // =========================

  useEffect(() => {

    loadReport({
      mobile: "",
      date: "",
    });

  }, []);


  // =========================
  // STAFF CHANGE
  // =========================

  const handleStaffChange =
    (e) => {

      const mobile =
        e.target.value;


      setSelectedMobile(
        mobile
      );


      loadReport({
        mobile,
        date: selectedDate,
      });

    };


  // =========================
  // DATE SEARCH
  // =========================

  const handleDateSearch = () => {

    if (!selectedDate) {
      return;
    }


    loadReport({
      mobile: selectedMobile,
      date: selectedDate,
    });

  };


  // =========================
  // CLEAR FILTER
  // =========================

  const handleClear = () => {

    setSelectedDate("");


    loadReport({
      mobile: selectedMobile,
      date: "",
    });

  };


  const dateFilterActive =
    Boolean(
      report?.filter?.date
    );


  return (

    <div className="space-y-4">


      {/* =========================
          HEADER
      ========================= */}

      <div className="rounded-xl bg-white p-4 shadow-sm">


        <h1 className="text-center text-xl font-semibold text-sky-700">

          Sales Report

        </h1>


        {/* =========================
            STAFF SELECT
        ========================= */}

        {(
          report?.viewer?.role === "manager" ||
          report?.viewer?.role === "admin"
        ) && (

          <div className="mx-auto mt-4 max-w-md">


            <label className="mb-1 block text-xs text-slate-500">

              Select Staff

            </label>


            <select
              value={selectedMobile}
              onChange={handleStaffChange}
              className="select select-bordered w-full cursor-pointer"
            >

              {report?.staffOptions?.map(
                (staff) => (

                  <option
                    key={staff.mobile}
                    value={staff.mobile}
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


        {/* =========================
            SELECTED STAFF
        ========================= */}

        {report?.selectedSeller && (

          <div className="mt-3 text-center">

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


        {/* =========================
            SINGLE DATE FILTER
        ========================= */}

        <div className="mt-4 flex flex-wrap items-end justify-center gap-2">


          <div>

            <label className="mb-1 block text-xs text-slate-500">

              Date

            </label>


            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="input input-sm input-bordered"
            />

          </div>


          <button
            type="button"
            onClick={handleDateSearch}
            className="btn btn-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
          >

            Search

          </button>


          <button
            type="button"
            onClick={handleClear}
            className="btn btn-sm cursor-pointer"
          >

            Clear Filter

          </button>


        </div>


      </div>


      {/* ERROR */}

      {error && (

        <div className="alert alert-error">

          {error}

        </div>

      )}


      {/* LOADING */}

      {loading ? (

        <div className="rounded-xl bg-white py-16 text-center shadow-sm">

          <span className="loading loading-spinner loading-md text-blue-600" />

        </div>

      ) : (

        <>


          {/* =========================
              FILTER INFO
          ========================= */}

          <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">


            {dateFilterActive ? (

              <>

                <p className="text-xs text-slate-400">

                  Sales Date

                </p>

                <p className="font-semibold text-slate-700">

                  {report.filter.date}

                </p>

              </>

            ) : (

              <>

                <p className="text-xs text-slate-400">

                  Last 7 Days

                </p>

                <p className="font-semibold text-slate-700">

                  {report?.range?.from}

                  {" → "}

                  {report?.range?.to}

                </p>

              </>

            )}


          </div>


          {/* =========================
              TOTAL
          ========================= */}

          <div className="grid gap-3 sm:grid-cols-2">


            <SummaryCard
              title={
                dateFilterActive
                  ? "Total Invoice"
                  : "Last 7 Days Invoice"
              }
              value={
                report?.summary?.totalInvoices ||
                0
              }
              icon={FaFileInvoice}
            />


            <SummaryCard
              title={
                dateFilterActive
                  ? "Total Payable"
                  : "Last 7 Days Payable"
              }
              value={`৳${money(
                report?.summary?.totalPayable
              )}`}
              icon={FaMoneyBillWave}
            />


          </div>


          {/* =========================
              CHART
              ONLY WITHOUT DATE FILTER
          ========================= */}

          {!dateFilterActive && (

            <div className="rounded-xl bg-white p-4 shadow-sm">


              <h2 className="font-semibold text-slate-700">

                Last 7 Days Sales

              </h2>


              <p className="mb-4 text-xs text-slate-400">

                {
                  report?.selectedSeller?.name
                }

                {" • "}

                {
                  report?.selectedSeller?.mobile
                }

              </p>


              <div className="h-72 w-full">


                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      report?.daily || []
                    }
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

          )}


          {/* =========================
              DATE WISE DATA
          ========================= */}

          <div className="rounded-xl bg-white p-4 shadow-sm">


            <h2 className="mb-3 font-semibold text-slate-700">

              Sales Details

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


                  {report?.daily?.length ? (

                    report.daily.map(
                      (item) => (

                        <tr
                          key={item.date}
                        >

                          <td className="font-medium">

                            {item.day}

                          </td>


                          <td>

                            {item.date}

                          </td>


                          <td className="text-center">

                            {
                              item.totalInvoices
                            }

                          </td>


                          <td className="text-right font-semibold text-emerald-700">

                            ৳
                            {
                              money(
                                item.totalPayable
                              )
                            }

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="py-8 text-center text-slate-400"
                      >

                        No sales found

                      </td>

                    </tr>

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


// =========================
// CARD
// =========================

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


// =========================
// TOOLTIP
// =========================

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
    payload[0].payload;


  return (

    <div className="rounded-lg border bg-white p-3 shadow-lg">

      <p className="font-semibold">

        {data.day}

      </p>

      <p className="text-xs text-slate-400">

        {data.date}

      </p>

      <p className="mt-2 text-sm">

        Invoice:{" "}

        <strong>
          {data.totalInvoices}
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