"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";


export default function Navbar() {

  const router =
    useRouter();

  const pathname =
    usePathname();


  // =========================
  // STATE
  // =========================

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  const [
    user,
    setUser,
  ] = useState(null);


  const [
    loadingUser,
    setLoadingUser,
  ] = useState(true);


  // =========================
  // GET CURRENT USER
  // =========================

  useEffect(() => {

    const getCurrentUser =
      async () => {

        try {

          const res =
            await fetch(
              "/api/auth/me",
              {
                cache:
                  "no-store",
              }
            );


          const data =
            await res.json();


          if (
            res.ok &&
            data.loggedIn
          ) {

            setUser(
              data.user
            );

          }
          else {

            setUser(null);

          }

        }
        catch (error) {

          console.error(
            "Navbar User Error:",
            error
          );


          setUser(null);

        }
        finally {

          setLoadingUser(false);

        }

      };


    getCurrentUser();

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout =
    async () => {

      try {

        const res =
          await fetch(
            "/api/auth/logout",
            {
              method:
                "POST",
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          console.error(
            data.message
          );

          return;

        }


        setUser(null);

        setProfileOpen(false);

        setIsOpen(false);


        router.push("/");

        router.refresh();

      }
      catch (error) {

        console.error(
          "Logout Error:",
          error
        );

      }

    };


  // =========================
  // SOFTWARE ACCESS
  // =========================

  const canSeeSoftware =
    Boolean(
      user &&
      [
        "salesman",
        "manager",
        "admin",
      ].includes(
        user.role
      )
    );


  // =========================
  // NAV ITEMS
  // =========================

  const navItems = [

    {
      name:
        "Home",

      href:
        "/",
    },


    ...(canSeeSoftware
      ? [
          {
            name:
              "Software",

            href:
              "/software",
          },
        ]
      : []),


    {
      name:
        "Medicine",

      href:
        "/viewOurMedicine",
    },


    {
      name:
        "Message Us",

      href:
        "/sendUsMessage",
    },

  ];


  // =========================
  // ACTIVE LINK
  // =========================

  const isActiveLink =
    (href) => {

      if (
        href === "/"
      ) {

        return (
          pathname === "/"
        );

      }


      return (
        pathname === href ||
        pathname?.startsWith(
          `${href}/`
        )
      );

    };


  return (

    <header className="sticky top-0 z-50 bg-white shadow-sm">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">


        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >


          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-blue-900 shadow-sm">


            <img
              src="/images/Logo2.jpg"
              alt="Sakin Pharmacy"
              className="h-full w-full object-cover"
            />


          </div>


          <div className="leading-none">


            <span className="block text-xl font-extrabold tracking-wide text-[#002D6D]">

              SAKIN

            </span>


            <span className="text-[10px] font-bold tracking-widest text-[#08781F]">

              PHARMACY

            </span>


          </div>


        </Link>


        {/* =========================
            DESKTOP NAV
        ========================= */}

        <div className="hidden items-center gap-1 rounded-xl bg-slate-50 p-1 md:flex">


          {navItems.map(
            ({
              name,
              href,
            }) => {

              const active =
                isActiveLink(
                  href
                );


              return (

                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-white text-[#08781F] shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-[#08781F]"
                  }`}
                >

                  {name}

                </Link>

              );

            }
          )}


        </div>


        {/* =========================
            DESKTOP PROFILE
        ========================= */}

        <div className="hidden md:block">


          {loadingUser ? (

            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />

          ) : user ? (

            <div className="relative">


              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
              >


                {/* AVATAR */}

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002D6D] text-sm font-bold text-white">

                  {getInitial(
                    user.name
                  )}

                </div>


                {/* USER INFO */}

                <div className="text-left">


                  <p className="max-w-32 truncate text-sm font-semibold text-[#002D6D]">

                    {user.name}

                  </p>


                  <p className="text-[10px] capitalize text-slate-400">

                    {user.role}

                  </p>


                </div>


                {/* ARROW */}

                <svg
                  className={`h-4 w-4 text-slate-400 transition ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 9-7 7-7-7"
                  />

                </svg>


              </button>


              {/* =========================
                  PROFILE DROPDOWN
              ========================= */}

              {profileOpen && (

                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl bg-white shadow-xl">


                  {/* PROFILE DETAILS */}

                  <div className="bg-slate-50 p-4">


                    <div className="flex items-center gap-3">


                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#002D6D] font-bold text-white">

                        {getInitial(
                          user.name
                        )}

                      </div>


                      <div className="min-w-0">


                        <p className="truncate font-semibold text-[#002D6D]">

                          {user.name}

                        </p>


                        <p className="mt-1 text-xs text-slate-500">

                          {user.mobile}

                        </p>


                      </div>


                    </div>


                    <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-[#08781F]">

                      {user.role}

                    </span>


                  </div>


                  {/* LOGOUT */}

                  <div className="p-2">


                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    >

                      Logout

                    </button>


                  </div>


                </div>

              )}


            </div>

          ) : (

            /* =========================
                NOT LOGGED IN
            ========================= */

            <Link
              href="/beACustomer"
              className="rounded-xl bg-[#002D6D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
            >

              Be a Customer

            </Link>

          )}


        </div>


        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(
              !isOpen
            )
          }
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-slate-50 text-[#002D6D] transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >


          {isOpen ? (

            /* CLOSE ICON */

            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18 18 6M6 6l12 12"
              />

            </svg>

          ) : (

            /* MENU ICON */

            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />

            </svg>

          )}


        </button>


      </nav>


      {/* =========================
          MOBILE MENU
      ========================= */}

      {isOpen && (

        <div className="bg-white px-4 pb-5 pt-2 shadow-sm md:hidden">


          {/* =========================
              MOBILE USER PROFILE
          ========================= */}

          {user && (

            <div className="mb-3 rounded-2xl bg-slate-50 p-4">


              <div className="flex items-center gap-3">


                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#002D6D] font-bold text-white">

                  {getInitial(
                    user.name
                  )}

                </div>


                <div className="min-w-0 flex-1">


                  <p className="truncate font-semibold text-[#002D6D]">

                    {user.name}

                  </p>


                  <p className="mt-0.5 text-xs text-slate-500">

                    {user.mobile}

                  </p>


                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-[#08781F]">

                    {user.role}

                  </span>


                </div>


              </div>


            </div>

          )}


          {/* =========================
              MOBILE NAV LINKS
          ========================= */}

          <div className="flex flex-col gap-1">


            {navItems.map(
              ({
                name,
                href,
              }) => {

                const active =
                  isActiveLink(
                    href
                  );


                return (

                  <Link
                    key={href}
                    href={href}
                    onClick={() =>
                      setIsOpen(
                        false
                      )
                    }
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-emerald-50 text-[#08781F]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#08781F]"
                    }`}
                  >

                    {name}

                  </Link>

                );

              }
            )}


            {/* =========================
                NOT LOGGED IN
            ========================= */}

            {!user &&
              !loadingUser && (

                <Link
                  href="/beACustomer"
                  onClick={() =>
                    setIsOpen(
                      false
                    )
                  }
                  className="mt-3 rounded-xl bg-[#002D6D] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
                >

                  Be a Customer

                </Link>

              )}


            {/* =========================
                LOGOUT
            ========================= */}

            {user && (

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="mt-3 cursor-pointer rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-100"
              >

                Logout

              </button>

            )}


          </div>


        </div>

      )}


    </header>

  );

}


// =========================
// GET FIRST LETTER
// =========================

function getInitial(name) {

  return (
    name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U"
  );

}