"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    FaCapsules,
    FaSearch,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";


const MEDICINES_PER_PAGE = 20;


export default function viewMedicine() {

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

                setCurrentPage(1);

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
                            cache:
                                "no-store",
                        }
                    );


                const data =
                    await res.json();


                if (!res.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load medicines"
                    );

                }


                setMedicines(
                    data.medicines ||
                    []
                );


                setTotalMedicines(
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
                    "Medicine Load Error:",
                    error
                );


                setError(
                    "We could not load the medicine list. Please try again."
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

        <main className="min-h-screen bg-slate-50">


            {/* =========================
          HERO
      ========================= */}

            <section className="bg-emerald-50 px-4 pb-12 pt-12 sm:pb-16 sm:pt-16">


                <div className="mx-auto max-w-4xl text-center">


                    {/* ICON */}

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">

                        <FaCapsules className="text-3xl" />

                    </div>


                    <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-700">

                        Sakin Pharmacy

                    </p>


                    <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">

                        Find Your Medicine

                    </h1>


                    <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">

                        Search our medicine list to quickly find
                        the product you need and check its current
                        listed price.

                    </p>


                    {/* =========================
              SEARCH
          ========================= */}

                    <div className="mx-auto mt-7 max-w-2xl">


                        <div className="flex items-center rounded-2xl bg-white px-4 shadow-lg">


                            <FaSearch className="shrink-0 text-lg text-emerald-700" />


                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={
                                    handleSearchChange
                                }
                                placeholder="Search by medicine name..."
                                autoComplete="off"
                                className="h-16 w-full bg-transparent px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-lg"
                            />


                            {search && (

                                <button
                                    type="button"
                                    onClick={
                                        clearSearch
                                    }
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                    aria-label="Clear search"
                                >

                                    <FaTimes />

                                </button>

                            )}


                        </div>


                        <p className="mt-3 text-sm text-slate-400">

                            Start typing the medicine name to search.

                        </p>


                    </div>


                </div>


            </section>


            {/* =========================
          MEDICINE AREA
      ========================= */}

            <section className="px-4 py-10 sm:py-12">


                <div className="mx-auto max-w-6xl">


                    {/* =========================
              RESULT HEADER
          ========================= */}

                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">


                        <div>

                            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">

                                {debouncedSearch
                                    ? "Search Results"
                                    : "Available Medicines"}

                            </h2>


                            <p className="mt-1 text-sm text-slate-500">

                                {loading
                                    ? "Finding medicines..."
                                    : totalMedicines > 0
                                        ? `Showing ${showingFrom}–${showingTo} of ${totalMedicines} medicines`
                                        : "Browse our medicine collection"}

                            </p>

                        </div>


                        {debouncedSearch && (

                            <div className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">

                                Search:{" "}

                                <span className="font-semibold">

                                    {debouncedSearch}

                                </span>

                            </div>

                        )}


                    </div>


                    {/* =========================
              LOADING
          ========================= */}

                    {loading ? (

                        <div className="flex min-h-80 items-center justify-center rounded-3xl bg-white shadow-sm">


                            <div className="text-center">


                                <span className="loading loading-spinner loading-lg text-emerald-700" />


                                <p className="mt-3 text-sm text-slate-500">

                                    Loading medicines...

                                </p>


                            </div>


                        </div>

                    ) : error ? (

                        /* =========================
                            ERROR
                        ========================= */

                        <div className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm">


                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                                <FaCapsules className="text-2xl" />

                            </div>


                            <h3 className="mt-4 text-lg font-semibold text-slate-700">

                                Unable to load medicines

                            </h3>


                            <p className="mt-2 text-sm text-slate-500">

                                {error}

                            </p>


                        </div>

                    ) : medicines.length === 0 ? (

                        /* =========================
                            EMPTY
                        ========================= */

                        <div className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm">


                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">

                                <FaSearch className="text-2xl" />

                            </div>


                            <h3 className="mt-4 text-xl font-semibold text-slate-700">

                                No medicine found

                            </h3>


                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                                We couldn&apos;t find a medicine matching
                                your search. Try checking the spelling or
                                search using another name.

                            </p>


                        </div>

                    ) : (

                        /* =========================
                            MEDICINE GRID
                        ========================= */

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                            {medicines.map(
                                (medicine) => (

                                    <article
                                        key={
                                            medicine._id
                                        }
                                        className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >


                                        <div className="flex items-start gap-4">


                                            {/* MEDICINE ICON */}

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

                                                <FaCapsules className="text-xl" />

                                            </div>


                                            {/* INFO */}

                                            <div className="min-w-0 flex-1">


                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                                                    Medicine

                                                </p>


                                                <h3 className="mt-1 whitespace-normal break-normal text-base font-semibold leading-6 text-slate-700">
                                                    {medicine.name}
                                                </h3>


                                            </div>


                                        </div>


                                        {/* PRICE */}

                                        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">


                                            <p className="text-xs font-medium text-slate-400">

                                                Listed Price

                                            </p>


                                            <p className="mt-1 text-xl font-bold text-emerald-700">

                                                ৳
                                                {Number(
                                                    medicine.salePrice ||
                                                    0
                                                ).toLocaleString(
                                                    "en-BD"
                                                )}

                                            </p>


                                        </div>


                                    </article>

                                )
                            )}


                        </div>

                    )}


                    {/* =========================
              PAGINATION
          ========================= */}

                    {!loading &&
                        !error &&
                        totalPages > 1 && (

                            <div className="mt-10 flex flex-col items-center justify-center gap-4">


                                <div className="flex items-center gap-3">


                                    <button
                                        type="button"
                                        disabled={
                                            currentPage <= 1
                                        }
                                        onClick={() => {

                                            setCurrentPage(
                                                (prev) =>
                                                    prev - 1
                                            );

                                            window.scrollTo({
                                                top: 0,
                                                behavior:
                                                    "smooth",
                                            });

                                        }}
                                        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        <FaChevronLeft className="text-xs" />

                                        Previous

                                    </button>


                                    <div className="flex h-11 items-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm">

                                        {currentPage}

                                        <span className="mx-2 opacity-50">

                                            /

                                        </span>

                                        {totalPages}

                                    </div>


                                    <button
                                        type="button"
                                        disabled={
                                            currentPage >=
                                            totalPages
                                        }
                                        onClick={() => {

                                            setCurrentPage(
                                                (prev) =>
                                                    prev + 1
                                            );

                                            window.scrollTo({
                                                top: 0,
                                                behavior:
                                                    "smooth",
                                            });

                                        }}
                                        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                        Next

                                        <FaChevronRight className="text-xs" />

                                    </button>


                                </div>


                                <p className="text-xs text-slate-400">

                                    20 medicines per page

                                </p>


                            </div>

                        )}


                </div>


            </section>


        </main>

    );

}