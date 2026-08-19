"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FaEdit,
  FaEye,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import Swal from "sweetalert2";

import {
  getDhakaDateOnly,
} from "@/lib/date";


const SALES_PER_PAGE = 50;


// =====================================
// PREVIOUS DATE
// =====================================

function getPreviousDate(
  dateString
) {

  const date =
    new Date(
      `${dateString}T00:00:00Z`
    );


  date.setUTCDate(
    date.getUTCDate() - 1
  );


  return date
    .toISOString()
    .slice(
      0,
      10
    );

}


// =====================================
// MONEY
// =====================================

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


// =====================================
// COMPONENT
// =====================================

export default function ViewDirectSale() {

  // =====================================
  // SALES
  // =====================================

  const [
    sales,
    setSales,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // =====================================
  // CURRENT USER
  // =====================================

  const [
    user,
    setUser,
  ] = useState(null);


  // =====================================
  // STAFF
  // =====================================

  const [
    staff,
    setStaff,
  ] = useState([]);


  const [
    ready,
    setReady,
  ] = useState(false);


  // =====================================
  // SALESMAN FILTER
  // =====================================

  const [
    salesmanFilter,
    setSalesmanFilter,
  ] = useState("");


  // =====================================
  // DATE FILTER
  // =====================================

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");


  const [
    appliedDate,
    setAppliedDate,
  ] = useState("");


  // =====================================
  // PAGINATION
  // =====================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    totalPages,
    setTotalPages,
  ] = useState(1);


  const [
    totalSales,
    setTotalSales,
  ] = useState(0);


  // =====================================
  // VIEW
  // =====================================

  const [
    selected,
    setSelected,
  ] = useState(null);


  // =====================================
  // EDIT
  // =====================================

  const [
    editing,
    setEditing,
  ] = useState(null);


  const [
    editSale,
    setEditSale,
  ] = useState("");


  const [
    editCustomer,
    setEditCustomer,
  ] = useState(1);


  const [
    editSalesmanNumber,
    setEditSalesmanNumber,
  ] = useState("");


  const [
    updating,
    setUpdating,
  ] = useState(false);


  // =====================================
  // DELETE
  // =====================================

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  // =====================================
  // LOAD USER + STAFF
  // =====================================

  const loadInitialData =
    async () => {

      try {

        setReady(false);


        const res =
          await fetch(
            "/api/software/direct-sales",
            {
              cache: "no-store",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to load staff"
          );

        }


        const currentUser =
          data.user ||
          null;


        const staffList =
          data.staff ||
          [];


        setUser(
          currentUser
        );


        setStaff(
          staffList
        );


        // =====================================
        // SALESMAN
        // ALWAYS OWN NUMBER
        // =====================================

        if (
          currentUser?.role ===
          "salesman"
        ) {

          setSalesmanFilter(
            currentUser.mobile
          );

        }
        else {

          // Manager/Admin
          // Default = All Salesman

          setSalesmanFilter("");

        }


        setReady(true);

      }
      catch (error) {

        console.error(
          "Initial Data Error:",
          error
        );


        setError(
          error.message ||
          "Failed to load data"
        );


        setReady(true);

      }

    };


  // =====================================
  // INITIAL
  // =====================================

  useEffect(() => {

    loadInitialData();

  }, []);


  // =====================================
  // LOAD SALES
  // =====================================

  const getSales =
    async () => {

      try {

        setLoading(true);

        setError("");


        const params =
          new URLSearchParams();


        params.set(
          "page",
          currentPage
        );


        params.set(
          "limit",
          SALES_PER_PAGE
        );


        // =====================================
        // DATE
        // =====================================

        if (
          appliedDate
        ) {

          params.set(
            "date",
            appliedDate
          );

        }


        // =====================================
        // SALESMAN
        // =====================================

        if (
          salesmanFilter
        ) {

          params.set(
            "salesmanNumber",
            salesmanFilter
          );

        }


        const res =
          await fetch(
            `/api/software/direct-sales/view?${params.toString()}`,
            {
              cache: "no-store",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to load direct sales"
          );

        }


        setSales(
          data.sales ||
          []
        );


        setTotalSales(
          data.pagination?.total ||
          0
        );


        setTotalPages(
          data.pagination?.totalPages ||
          1
        );

      }
      catch (error) {

        console.error(
          "Direct Sale Load Error:",
          error
        );


        setError(
          error.message ||
          "Failed to load direct sales"
        );

      }
      finally {

        setLoading(false);

      }

    };


  // =====================================
  // LOAD SALES WHEN FILTER CHANGES
  // =====================================

  useEffect(() => {

    if (!ready) {
      return;
    }


    getSales();

  }, [
    ready,
    currentPage,
    appliedDate,
    salesmanFilter,
  ]);


  // =====================================
  // SALESMAN FILTER
  // MANAGER / ADMIN ONLY
  // =====================================

  const handleSalesmanFilter =
    (e) => {

      if (
        user?.role ===
        "salesman"
      ) {

        return;

      }


      setSalesmanFilter(
        e.target.value
      );


      setCurrentPage(1);

    };


  // =====================================
  // DATE SEARCH
  // =====================================

  const handleDateSearch = () => {

    if (!selectedDate) {
      return;
    }


    setAppliedDate(
      selectedDate
    );


    setCurrentPage(1);

  };


  // =====================================
  // TODAY
  // =====================================

  const handleToday = () => {

    const today =
      getDhakaDateOnly();


    setSelectedDate(
      today
    );


    setAppliedDate(
      today
    );


    setCurrentPage(1);

  };


  // =====================================
  // YESTERDAY
  // =====================================

  const handleYesterday = () => {

    const yesterday =
      getPreviousDate(
        getDhakaDateOnly()
      );


    setSelectedDate(
      yesterday
    );


    setAppliedDate(
      yesterday
    );


    setCurrentPage(1);

  };


  // =====================================
  // CLEAR FILTER
  // =====================================

  const handleClearFilter = () => {

    setSelectedDate("");

    setAppliedDate("");


    // SALESMAN LOGIN
    // OWN FILTER MUST REMAIN

    if (
      user?.role ===
      "salesman"
    ) {

      setSalesmanFilter(
        user.mobile
      );

    }
    else {

      // Manager/Admin
      // clear salesman filter

      setSalesmanFilter("");

    }


    setCurrentPage(1);

  };


  // =====================================
  // VIEW
  // =====================================

  const handleView =
    (sale) => {

      setSelected(
        sale
      );


      document
        .getElementById(
          "direct_sale_view_modal"
        )
        ?.showModal();

    };


  // =====================================
  // EDIT
  // =====================================

  const handleEdit =
    (sale) => {

      setEditing(
        sale
      );


      setEditSale(
        sale.sale
      );


      setEditCustomer(
        sale.customer ||
        1
      );


      // Salesman নিজেরটাই থাকবে

      if (
        user?.role ===
        "salesman"
      ) {

        setEditSalesmanNumber(
          user.mobile
        );

      }
      else {

        setEditSalesmanNumber(
          sale.salesman?.number ||
          ""
        );

      }


      document
        .getElementById(
          "direct_sale_edit_modal"
        )
        ?.showModal();

    };


  // =====================================
  // UPDATE
  // =====================================

  const handleUpdate =
    async () => {

      if (
        !editing?._id
      ) {

        return;

      }


      if (
        !editSale ||
        Number(editSale) <= 0
      ) {

        await Swal.fire({

          title:
            "Invalid Amount",

          text:
            "Enter a valid sale amount.",

          icon:
            "warning",

        });

        return;

      }


      if (
        !editCustomer ||
        Number(editCustomer) < 1
      ) {

        await Swal.fire({

          title:
            "Invalid Customer",

          text:
            "Customer must be at least 1.",

          icon:
            "warning",

        });

        return;

      }


      if (
        !editSalesmanNumber
      ) {

        return;

      }


      try {

        setUpdating(true);


        const res =
          await fetch(
            `/api/software/direct-sales/${editing._id}`,
            {
              method:
                "PATCH",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  sale:
                    Number(
                      editSale
                    ),

                  customer:
                    Number(
                      editCustomer
                    ),

                  salesmanNumber:
                    editSalesmanNumber,

                }),

            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to update"
          );

        }


        document
          .getElementById(
            "direct_sale_edit_modal"
          )
          ?.close();


        setEditing(null);


        await Swal.fire({

          title:
            "Updated!",

          text:
            "Direct sale updated successfully.",

          icon:
            "success",

          timer:
            900,

          showConfirmButton:
            false,

        });


        await getSales();

      }
      catch (error) {

        console.error(
          "Direct Sale Update Error:",
          error
        );


        await Swal.fire({

          title:
            "Failed",

          text:
            error.message ||
            "Failed to update direct sale",

          icon:
            "error",

        });

      }
      finally {

        setUpdating(false);

      }

    };


  // =====================================
  // DELETE
  // =====================================

  const handleDelete =
    async (sale) => {

      if (
        deletingId
      ) {

        return;

      }


      const result =
        await Swal.fire({

          title:
            "Delete Direct Sale?",

          text:
            `৳${money(
              sale.sale
            )} sale will be deleted.`,

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Delete",

          cancelButtonText:
            "Cancel",

          confirmButtonColor:
            "#dc2626",

        });


      if (
        !result.isConfirmed
      ) {

        return;

      }


      try {

        setDeletingId(
          sale._id
        );


        const res =
          await fetch(
            `/api/software/direct-sales/${sale._id}`,
            {
              method:
                "DELETE",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Delete failed"
          );

        }


        await Swal.fire({

          title:
            "Deleted!",

          text:
            "Direct sale deleted successfully.",

          icon:
            "success",

          timer:
            900,

          showConfirmButton:
            false,

        });


        if (
          sales.length === 1 &&
          currentPage > 1
        ) {

          setCurrentPage(
            (prev) =>
              prev - 1
          );

        }
        else {

          await getSales();

        }

      }
      catch (error) {

        console.error(
          "Direct Sale Delete Error:",
          error
        );


        await Swal.fire({

          title:
            "Failed",

          text:
            error.message ||
            "Failed to delete direct sale",

          icon:
            "error",

        });

      }
      finally {

        setDeletingId(null);

      }

    };


  // =====================================
  // PAGINATION
  // =====================================

  const showingFrom =
    totalSales > 0

      ? (
          currentPage - 1
        ) *
        SALES_PER_PAGE
        + 1

      : 0;


  const showingTo =
    Math.min(
      currentPage *
      SALES_PER_PAGE,

      totalSales
    );


  // =====================================
  // SELECTED SALESMAN NAME
  // =====================================

  const selectedSalesman =
    staff.find(
      (item) =>
        String(
          item.mobile
        ) ===
        String(
          salesmanFilter
        )
    );


  // =====================================
  // UI
  // =====================================

  return (

    <div className="rounded-xl bg-white p-4 shadow-sm">


      {/* =====================================
          TITLE
      ===================================== */}

      <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">

        View Direct Sale

      </h1>


      {/* =====================================
          FILTERS
          SAME ROW
      ===================================== */}

      <div className="mb-4 flex flex-wrap items-end gap-2">


        {/* =====================================
            SALESMAN
        ===================================== */}

        <div className="w-full sm:w-64">


          <label className="mb-1 block text-xs text-slate-500">

            Salesman

          </label>


          {/* SALESMAN LOGIN */}

          {user?.role ===
          "salesman" ? (

            <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">


              <FaUser className="text-xs text-slate-400" />


              <span className="truncate">

                {user.name}

                {" - "}

                {user.mobile}

              </span>


            </div>

          ) : (

            // MANAGER / ADMIN

            <div className="relative">


              <FaUser className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-slate-400" />


              <select
                value={
                  salesmanFilter
                }
                onChange={
                  handleSalesmanFilter
                }
                className="select select-sm select-bordered w-full cursor-pointer pl-9"
              >


                <option value="">

                  All Salesman

                </option>


                {staff.map(
                  (item) => (

                    <option
                      key={
                        item.mobile
                      }
                      value={
                        item.mobile
                      }
                    >

                      {item.name}

                      {" - "}

                      {item.mobile}

                    </option>

                  )
                )}


              </select>


            </div>

          )}


        </div>


        {/* =====================================
            DATE
        ===================================== */}

        <div>


          <label className="mb-1 block text-xs text-slate-500">

            Date

          </label>


          <input
            type="date"
            value={
              selectedDate
            }
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="input input-sm input-bordered"
          />


        </div>


        {/* SEARCH DATE */}

        <button
          type="button"
          onClick={
            handleDateSearch
          }
          className="btn btn-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
        >

          Search Date

        </button>


        {/* TODAY */}

        <button
          type="button"
          onClick={
            handleToday
          }
          className="btn btn-sm cursor-pointer"
        >

          Today

        </button>


        {/* YESTERDAY */}

        <button
          type="button"
          onClick={
            handleYesterday
          }
          className="btn btn-sm cursor-pointer"
        >

          Yesterday

        </button>


        {/* CLEAR */}

        <button
          type="button"
          onClick={
            handleClearFilter
          }
          className="btn btn-sm cursor-pointer"
        >

          Clear Filter

        </button>


      </div>


      {/* =====================================
          RESULT COUNT
      ===================================== */}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">


        <span>

          Showing{" "}

          <strong>
            {showingFrom}
          </strong>

          {" - "}

          <strong>
            {showingTo}
          </strong>

          {" of "}

          <strong>
            {totalSales}
          </strong>

        </span>


        <div className="flex flex-wrap gap-3">


          {appliedDate && (

            <span>

              Date:{" "}

              <strong className="text-blue-600">

                {appliedDate}

              </strong>

            </span>

          )}


          {salesmanFilter && (

            <span>

              Salesman:{" "}

              <strong className="text-blue-600">

                {
                  selectedSalesman
                    ?.name ||
                  user?.name ||
                  "-"
                }

              </strong>

            </span>

          )}


        </div>


      </div>


      {/* =====================================
          TABLE
      ===================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-100">


        <div className="overflow-x-auto">


          <table className="table">


            <thead>

              <tr className="bg-slate-50 text-slate-600">


                <th className="w-16">

                  SL

                </th>


                <th>

                  Date

                </th>


                <th>

                  Salesman

                </th>


                <th>

                  Amount

                </th>


                <th className="text-center">

                  Action

                </th>


              </tr>

            </thead>


            <tbody>


              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-12 text-center"
                  >

                    <span className="loading loading-spinner loading-md text-blue-600" />

                  </td>

                </tr>

              ) : error ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-10 text-center text-red-500"
                  >

                    {error}

                  </td>

                </tr>

              ) : sales.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-400"
                  >

                    No direct sale found

                  </td>

                </tr>

              ) : (

                sales.map(
                  (
                    directSale,
                    index
                  ) => (

                    <tr
                      key={
                        directSale._id
                      }
                      className="hover:bg-slate-50"
                    >


                      {/* SL */}

                      <td className="text-slate-400">

                        {
                          (
                            currentPage - 1
                          ) *
                          SALES_PER_PAGE
                          +
                          index
                          +
                          1
                        }

                      </td>


                      {/* DATE */}

                      <td className="whitespace-nowrap">

                        {
                          directSale.date
                        }

                      </td>


                      {/* SALESMAN */}

                      <td>

                        <p className="font-medium text-slate-700">

                          {
                            directSale.salesman
                              ?.name ||
                            "-"
                          }

                        </p>


                        <p className="text-xs text-slate-400">

                          {
                            directSale.salesman
                              ?.number ||
                            "-"
                          }

                        </p>

                      </td>


                      {/* AMOUNT */}

                      <td className="font-semibold text-emerald-700">

                        ৳
                        {
                          money(
                            directSale.sale
                          )
                        }

                      </td>


                      {/* ACTION */}

                      <td>


                        <div className="flex items-center justify-center gap-2">


                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                directSale
                              )
                            }
                            className="btn btn-square btn-sm cursor-pointer border-0 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            title="View"
                          >

                            <FaEye />

                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                directSale
                              )
                            }
                            className="btn btn-square btn-sm cursor-pointer border-0 bg-amber-50 text-amber-600 hover:bg-amber-100"
                            title="Edit"
                          >

                            <FaEdit />

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              directSale._id
                            }
                            onClick={() =>
                              handleDelete(
                                directSale
                              )
                            }
                            className="btn btn-square btn-sm cursor-pointer border-0 bg-red-50 text-red-600 hover:bg-red-100 disabled:cursor-wait"
                            title="Delete"
                          >

                            {deletingId ===
                            directSale._id ? (

                              <span className="loading loading-spinner loading-xs" />

                            ) : (

                              <FaTrash />

                            )}

                          </button>


                        </div>


                      </td>


                    </tr>

                  )
                )

              )}


            </tbody>


          </table>


        </div>


      </div>


      {/* =====================================
          PAGINATION
      ===================================== */}

      {totalPages > 1 && (

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">


          <button
            type="button"
            disabled={
              currentPage <= 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev - 1
              )
            }
            className="btn btn-sm cursor-pointer disabled:cursor-not-allowed"
          >

            Previous

          </button>


          <span className="px-3 text-sm text-slate-500">

            Page{" "}

            <strong>
              {currentPage}
            </strong>

            {" of "}

            <strong>
              {totalPages}
            </strong>

          </span>


          <button
            type="button"
            disabled={
              currentPage >=
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev + 1
              )
            }
            className="btn btn-sm cursor-pointer disabled:cursor-not-allowed"
          >

            Next

          </button>


        </div>

      )}


      {/* =====================================
          VIEW MODAL
      ===================================== */}

      <dialog
        id="direct_sale_view_modal"
        className="modal"
      >


        <div className="modal-box">


          <form method="dialog">

            <button
              type="submit"
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 cursor-pointer"
            >

              ✕

            </button>

          </form>


          <h3 className="mb-5 text-lg font-bold text-slate-800">

            Direct Sale Details

          </h3>


          {selected && (

            <div className="space-y-3">


              <DetailRow
                label="Date"
                value={
                  selected.date
                }
              />


              <DetailRow
                label="Sale Amount"
                value={`৳${money(
                  selected.sale
                )}`}
              />


              <DetailRow
                label="Customer"
                value={
                  selected.customer
                }
              />


              <DetailRow
                label="Salesman"
                value={
                  selected.salesman
                    ?.name
                }
              />


              <DetailRow
                label="Salesman Number"
                value={
                  selected.salesman
                    ?.number
                }
              />


              <DetailRow
                label="Added By"
                value={
                  selected.addedBy
                    ?.name
                }
              />


              <DetailRow
                label="Added By Number"
                value={
                  selected.addedBy
                    ?.number
                }
              />


            </div>

          )}


        </div>


        <form
          method="dialog"
          className="modal-backdrop"
        >

          <button>
            close
          </button>

        </form>


      </dialog>


      {/* =====================================
          EDIT MODAL
      ===================================== */}

      <dialog
        id="direct_sale_edit_modal"
        className="modal"
      >


        <div className="modal-box">


          <form method="dialog">

            <button
              type="submit"
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 cursor-pointer"
            >

              ✕

            </button>

          </form>


          <h3 className="mb-5 text-lg font-bold text-slate-800">

            Edit Direct Sale

          </h3>


          <div className="space-y-4">


            {/* SALE */}

            <div>


              <label className="mb-1 block text-sm text-slate-500">

                Sale Amount

              </label>


              <input
                type="number"
                min="1"
                value={
                  editSale
                }
                onChange={(e) =>
                  setEditSale(
                    e.target.value
                  )
                }
                className="input input-bordered w-full"
              />


            </div>


            {/* CUSTOMER */}

            <div>


              <label className="mb-1 block text-sm text-slate-500">

                Customer

              </label>


              <input
                type="number"
                min="1"
                value={
                  editCustomer
                }
                onChange={(e) =>
                  setEditCustomer(
                    e.target.value
                  )
                }
                className="input input-bordered w-full"
              />


            </div>


            {/* SALESMAN */}

            <div>


              <label className="mb-1 block text-sm text-slate-500">

                Salesman

              </label>


              {user?.role ===
              "salesman" ? (

                <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">

                  {user.name}

                  {" - "}

                  {user.mobile}

                </div>

              ) : (

                <select
                  value={
                    editSalesmanNumber
                  }
                  onChange={(e) =>
                    setEditSalesmanNumber(
                      e.target.value
                    )
                  }
                  className="select select-bordered w-full cursor-pointer"
                >


                  {staff.map(
                    (item) => (

                      <option
                        key={
                          item.mobile
                        }
                        value={
                          item.mobile
                        }
                      >

                        {item.name}

                        {" - "}

                        {item.mobile}

                      </option>

                    )
                  )}


                </select>

              )}


            </div>


            {/* UPDATE */}

            <button
              type="button"
              onClick={
                handleUpdate
              }
              disabled={
                updating
              }
              className="btn w-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-wait"
            >

              {updating ? (

                <>

                  <span className="loading loading-spinner loading-sm" />

                  Updating...

                </>

              ) : (

                "Update Sale"

              )}

            </button>


          </div>


        </div>


        <form
          method="dialog"
          className="modal-backdrop"
        >

          <button>
            close
          </button>

        </form>


      </dialog>


    </div>

  );

}


// =====================================
// DETAIL ROW
// =====================================

function DetailRow({
  label,
  value,
}) {

  return (

    <div className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">


      <span className="text-sm text-slate-500">

        {label}

      </span>


      <span className="break-all text-right text-sm font-medium text-slate-700">

        {value ?? "-"}

      </span>


    </div>

  );

}