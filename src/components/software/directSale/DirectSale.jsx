"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FaMoneyBillWave,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import Swal from "sweetalert2";

import {
  getDhakaDateOnly,
} from "@/lib/date";


export default function DirectSale() {

  // =========================
  // FORM
  // =========================

  const [
    sale,
    setSale,
  ] = useState("");


  const [
    customer,
    setCustomer,
  ] = useState(1);


  const [
    salesmanNumber,
    setSalesmanNumber,
  ] = useState("");


  // =========================
  // USER / STAFF
  // =========================

  const [
    user,
    setUser,
  ] = useState(null);


  const [
    staff,
    setStaff,
  ] = useState([]);


  // =========================
  // LOADING
  // =========================

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  // =========================
  // LOAD DATA
  // =========================

  const loadData =
    async () => {

      try {

        setLoading(true);


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
            "Failed to load data"
          );

        }


        setUser(
          data.user
        );


        setStaff(
          data.staff || []
        );


        // =========================
        // DEFAULT SELECTED STAFF
        // LOGGED-IN USER
        // =========================

        const currentUserExists =
          (data.staff || []).some(
            (item) =>
              String(
                item.mobile
              ) ===
              String(
                data.user?.mobile
              )
          );


        if (
          currentUserExists
        ) {

          setSalesmanNumber(
            data.user.mobile
          );

        }
        else if (
          data.staff?.length
        ) {

          setSalesmanNumber(
            data.staff[0].mobile
          );

        }

      }
      catch (error) {

        console.error(
          "Direct Sale Load Error:",
          error
        );


        await Swal.fire({

          title: "Error",

          text:
            error.message ||
            "Failed to load direct sale data",

          icon: "error",

        });

      }
      finally {

        setLoading(false);

      }

    };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadData();

  }, []);


  // =========================
  // SAVE
  // =========================

  const handleSave =
    async () => {

      if (
        !sale ||
        Number(sale) <= 0
      ) {

        await Swal.fire({

          title:
            "Enter Sale Amount",

          icon:
            "warning",

        });

        return;

      }


      if (
        !customer ||
        Number(customer) < 1
      ) {

        await Swal.fire({

          title:
            "Invalid Customer",

          text:
            "Customer must be at least 1",

          icon:
            "warning",

        });

        return;

      }


      if (
        !salesmanNumber
      ) {

        await Swal.fire({

          title:
            "Select Staff",

          icon:
            "warning",

        });

        return;

      }


      try {

        setSaving(true);


        const res =
          await fetch(
            "/api/software/direct-sales",
            {
              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  sale:
                    Number(sale),

                  customer:
                    Number(customer),

                  salesmanNumber,

                  date:
                    getDhakaDateOnly(),

                }),

            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          throw new Error(
            data.message ||
            "Failed to save sale"
          );

        }


        // =========================
        // RESET
        // =========================

        setSale("");

        setCustomer(1);


        // Logged-in user আবার
        // default selected হবে

        if (user?.mobile) {

          setSalesmanNumber(
            user.mobile
          );

        }


        await Swal.fire({

          title:
            "Saved!",

          text:
            "Direct sale added successfully",

          icon:
            "success",

          timer:
            900,

          showConfirmButton:
            false,

        });

      }
      catch (error) {

        console.error(
          "Direct Sale Save Error:",
          error
        );


        await Swal.fire({

          title:
            "Failed",

          text:
            error.message ||
            "Failed to save direct sale",

          icon:
            "error",

        });

      }
      finally {

        setSaving(false);

      }

    };


  // =========================
  // SELECTED STAFF
  // =========================

  const selectedStaff =
    staff.find(
      (item) =>
        String(
          item.mobile
        ) ===
        String(
          salesmanNumber
        )
    );


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="flex min-h-60 items-center justify-center">

        <span className="loading loading-spinner loading-md text-blue-600" />

      </div>

    );

  }


  // =========================
  // UI
  // =========================

  return (

    <div className="mx-auto max-w-xl">


      <div className="rounded-xl bg-white p-5 shadow-sm">


        {/* =========================
            TITLE
        ========================= */}

        <h1 className="text-center text-xl font-semibold text-sky-700">

          Direct Sale

        </h1>


        <p className="mt-1 text-center text-xs text-slate-400">

          {getDhakaDateOnly()}

        </p>


        {/* =========================
            FORM
        ========================= */}

        <div className="mt-6 space-y-4">


          {/* =========================
              SALE AMOUNT
          ========================= */}

          <div>


            <label className="mb-1.5 block text-sm font-medium text-slate-600">

              Sale Amount

            </label>


            <div className="relative">


              <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />


              <input
                type="number"
                min="1"
                value={sale}
                onChange={(e) =>
                  setSale(
                    e.target.value
                  )
                }
                placeholder="Enter sale amount"
                className="input input-bordered w-full pl-10"
              />


            </div>


          </div>


          {/* =========================
              CUSTOMER
          ========================= */}

          <div>


            <label className="mb-1.5 block text-sm font-medium text-slate-600">

              Customer

            </label>


            <div className="relative">


              <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />


              <input
                type="number"
                min="1"
                value={customer}
                onChange={(e) =>
                  setCustomer(
                    e.target.value
                  )
                }
                className="input input-bordered w-full pl-10"
              />


            </div>


          </div>


          {/* =========================
              STAFF
          ========================= */}

          <div>


            <label className="mb-1.5 block text-sm font-medium text-slate-600">

              Salesman

            </label>


            <div className="relative">


              <FaUser className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />


              <select
                value={
                  salesmanNumber
                }
                onChange={(e) =>
                  setSalesmanNumber(
                    e.target.value
                  )
                }
                className="select select-bordered w-full cursor-pointer pl-10"
              >


                <option value="">

                  Select Salesman

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


          </div>


          {/* =========================
              SELECTED STAFF
          ========================= */}

          {selectedStaff && (

            <div className="rounded-lg bg-slate-50 px-4 py-3">


              <p className="text-xs text-slate-400">

                Sale will be added for

              </p>


              <p className="mt-1 text-sm font-semibold text-slate-700">

                {
                  selectedStaff.name
                }

              </p>


              <p className="text-xs text-slate-500">

                {
                  selectedStaff.mobile
                }

              </p>


            </div>

          )}


          {/* =========================
              ADDED BY
          ========================= */}

          {user && (

            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-3">


              <p className="text-xs text-slate-400">

                Added By

              </p>


              <p className="mt-1 text-sm font-medium text-slate-600">

                {user.name}

                {" - "}

                {user.mobile}

              </p>


            </div>

          )}


          {/* =========================
              SAVE
          ========================= */}

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              saving
            }
            className="btn w-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-wait"
          >

            {saving ? (

              <>

                <span className="loading loading-spinner loading-sm" />

                Saving...

              </>

            ) : (

              "Add Direct Sale"

            )}

          </button>


        </div>


      </div>


    </div>

  );

}