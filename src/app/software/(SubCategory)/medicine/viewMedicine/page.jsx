"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FaEye,
  FaSearch,
  FaTimes,
} from "react-icons/fa";


const MEDICINES_PER_PAGE = 50;


export default function ViewMedicinePage() {

  // =========================
  // MEDICINES
  // =========================

  const [
    medicines,
    setMedicines,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // =========================
  // VIEW
  // =========================

  const [
    selected,
    setSelected,
  ] = useState(null);


  // =========================
  // DELETE
  // =========================

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  // =========================
  // SEARCH
  // =========================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");


  // =========================
  // PAGINATION
  // =========================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalMedicines,
    setTotalMedicines,
  ] = useState(0);


  // =========================
  // SEARCH DEBOUNCE
  // =========================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setDebouncedSearch(
          search.trim()
        );

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [search]);


  // =========================
  // GET MEDICINES
  // =========================

  const getMedicines =
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
          MEDICINES_PER_PAGE
        );


        if (
          debouncedSearch
        ) {

          params.set(
            "q",
            debouncedSearch
          );

        }


        const res =
          await fetch(
            `/api/software/medicines/view?${params.toString()}`,
            {
              cache: "no-store",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to load medicines"
          );

        }


        setMedicines(
          data.medicines || []
        );


        setTotalMedicines(
          data.pagination?.total || 0
        );


        setTotalPages(
          data.pagination?.totalPages || 1
        );

      }
      catch (error) {

        console.error(
          "Medicine Load Error:",
          error
        );


        setError(
          "Failed to load medicines"
        );

      }
      finally {

        setLoading(false);

      }

    };


  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    getMedicines();

  }, [
    currentPage,
    debouncedSearch,
  ]);


  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange =
    (e) => {

      setSearch(
        e.target.value
      );

      setCurrentPage(1);

    };


  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {

    setSearch("");

    setDebouncedSearch("");

    setCurrentPage(1);

  };


  // =========================
  // VIEW
  // =========================

  const handleView =
    (medicine) => {

      setSelected(
        medicine
      );


      document
        .getElementById(
          "medicine_details_modal"
        )
        ?.showModal();

    };


  // =========================
  // DELETE
  // NO POPUP
  // =========================

  const handleDelete =
    async (medicine) => {

      if (deletingId) {
        return;
      }


      try {

        setDeletingId(
          medicine._id
        );


        const res =
          await fetch(
            `/api/software/medicines/${medicine._id}`,
            {
              method: "DELETE",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          console.error(
            data.message ||
            "Delete failed"
          );

          return;

        }


        if (
          medicines.length === 1 &&
          currentPage > 1
        ) {

          setCurrentPage(
            (prev) =>
              prev - 1
          );

        }
        else {

          await getMedicines();

        }

      }
      catch (error) {

        console.error(
          "Medicine Delete Error:",
          error
        );

      }
      finally {

        setDeletingId(null);

      }

    };


  // =========================
  // SHOWING COUNT
  // =========================

  const showingFrom =

    totalMedicines > 0

      ? (
          currentPage - 1
        ) *
        MEDICINES_PER_PAGE
        + 1

      : 0;


  const showingTo =

    Math.min(

      currentPage *
      MEDICINES_PER_PAGE,

      totalMedicines

    );


  return (

    <div className="rounded-xl bg-white p-4 shadow-sm">


      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


        <h1 className="text-xl font-semibold text-sky-700">

          View Medicine

        </h1>


        {/* =========================
            SEARCH ONLY
            NO DROPDOWN
        ========================= */}

        <div className="flex w-full items-center rounded-lg border border-slate-200 bg-white sm:w-80">


          <FaSearch className="ml-3 text-sm text-slate-400" />


          <input
            type="text"
            value={search}
            onChange={
              handleSearchChange
            }
            placeholder="Search medicine..."
            autoComplete="off"
            className="h-10 w-full bg-transparent px-3 text-sm outline-none"
          />


          {search && (

            <button
              type="button"
              onClick={
                clearSearch
              }
              className="mr-2 flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500"
            >

              <FaTimes />

            </button>

          )}


        </div>


      </div>


      {/* =========================
          RESULT COUNT
      ========================= */}

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
            {totalMedicines}
          </strong>

        </span>


        {debouncedSearch && (

          <span>

            Search:{" "}

            <strong className="text-blue-600">
              {debouncedSearch}
            </strong>

          </span>

        )}


      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-slate-100">


        <div className="overflow-x-auto">


          <table className="table">


            <thead>

              <tr className="bg-slate-50 text-slate-600">


                <th className="w-16">

                  SL

                </th>


                <th>

                  Name

                </th>


                <th>

                  Price

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
                    colSpan="4"
                    className="py-12 text-center"
                  >

                    <span className="loading loading-spinner loading-md text-blue-600" />

                  </td>

                </tr>

              ) : error ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-10 text-center text-red-500"
                  >

                    {error}

                  </td>

                </tr>

              ) : medicines.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-10 text-center text-slate-400"
                  >

                    No medicine found

                  </td>

                </tr>

              ) : (

                medicines.map(
                  (
                    medicine,
                    index
                  ) => (

                    <tr
                      key={
                        medicine._id
                      }
                      className="hover:bg-slate-50"
                    >


                      {/* SL */}

                      <td className="text-slate-400">

                        {
                          (
                            currentPage - 1
                          ) *
                          MEDICINES_PER_PAGE
                          +
                          index
                          +
                          1
                        }

                      </td>


                      {/* NAME */}

                      <td className="font-medium text-slate-700">

                        {
                          medicine.name
                        }

                      </td>


                      {/* PRICE */}

                      <td className="font-semibold text-emerald-700">

                        ৳
                        {
                          medicine.salePrice
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
                                medicine
                              )
                            }
                            className="btn btn-sm cursor-pointer border-0 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >

                            <FaEye />

                            <span className="hidden sm:inline">

                              View

                            </span>

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                medicine
                              )
                            }
                            disabled={
                              deletingId ===
                              medicine._id
                            }
                            className="btn btn-square btn-sm cursor-pointer border-0 bg-red-50 text-red-600 hover:bg-red-100 disabled:cursor-wait"
                            title="Delete"
                          >

                            {deletingId ===
                            medicine._id ? (

                              <span className="loading loading-spinner loading-xs" />

                            ) : (

                              <FaTimes />

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


      {/* =========================
          PAGINATION
      ========================= */}

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


      {/* =========================
          VIEW MODAL
      ========================= */}

      <dialog
        id="medicine_details_modal"
        className="modal"
      >


        <div className="modal-box">


          {/* CLOSE */}

          <form method="dialog">

            <button
              type="submit"
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 cursor-pointer"
            >

              ✕

            </button>

          </form>


          <h3 className="mb-5 text-lg font-bold text-slate-800">

            Medicine Details

          </h3>


          {selected && (

            <div className="space-y-3">


              <DetailRow
                label="ID"
                value={
                  selected._id
                }
              />


              <DetailRow
                label="Name"
                value={
                  selected.name
                }
              />


              <DetailRow
                label="Search Name"
                value={
                  selected.searchName
                }
              />


              <DetailRow
                label="Sale Price"
                value={`৳${selected.salePrice}`}
              />


              <DetailRow
                label="Status"
                value={
                  selected.isActive
                    ? "Active"
                    : "Inactive"
                }
              />


              <div className="divider my-2" />


              <p className="text-xs font-semibold uppercase text-slate-400">

                Created By

              </p>


              <DetailRow
                label="Name"
                value={
                  selected
                    .createdBy
                    ?.name ||
                  "-"
                }
              />


              <DetailRow
                label="Mobile"
                value={
                  selected
                    .createdBy
                    ?.mobile ||
                  "-"
                }
              />


              <div className="divider my-2" />


              <p className="text-xs font-semibold uppercase text-slate-400">

                Updated By

              </p>


              <DetailRow
                label="Name"
                value={
                  selected
                    .updatedBy
                    ?.name ||
                  "-"
                }
              />


              <DetailRow
                label="Mobile"
                value={
                  selected
                    .updatedBy
                    ?.mobile ||
                  "-"
                }
              />


              <div className="divider my-2" />


              <DetailRow
                label="Created At"
                value={
                  formatDate(
                    selected.createdAt
                  )
                }
              />


              <DetailRow
                label="Updated At"
                value={
                  formatDate(
                    selected.updatedAt
                  )
                }
              />


            </div>

          )}


        </div>


        {/* BACKDROP */}

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



// =========================
// DETAIL ROW
// =========================

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



// =========================
// DATE FORMAT
// =========================

function formatDate(date) {

  if (!date) {

    return "-";

  }


  return new Date(
    date
  ).toLocaleString(
    "en-GB"
  );

}