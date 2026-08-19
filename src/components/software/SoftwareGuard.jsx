"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


export default function SoftwareGuard({
  children,
}) {

  const router =
    useRouter();


  const [
    checking,
    setChecking,
  ] = useState(true);


  useEffect(() => {

    const checkUser =
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


          // =========================
          // NOT LOGGED IN
          // =========================

          if (
            !res.ok ||
            !data?.user
          ) {

            router.replace("/");

            return;
          }


          const role =
            data.user.role;


          // =========================
          // CUSTOMER
          // NO SOFTWARE ACCESS
          // =========================

          if (
            role ===
            "customer"
          ) {

            router.replace("/");

            return;
          }


          // =========================
          // ONLY STAFF
          // =========================

          if (
            ![
              "salesman",
              "manager",
              "admin",
            ].includes(
              role
            )
          ) {

            router.replace("/");

            return;
          }


          setChecking(false);

        }
        catch (error) {

          console.error(
            "Software Guard Error:",
            error
          );


          router.replace("/");

        }

      };


    checkUser();

  }, [router]);


  // =========================
  // CHECKING
  // =========================

  if (checking) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">


        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">


          <span className="loading loading-spinner loading-sm text-[#123B6D]" />


          <div>

            <p className="text-sm font-bold text-[#123B6D]">

              Sakin Pharmacy

            </p>


            <p className="text-[11px] text-slate-400">

              Checking access...

            </p>

          </div>


        </div>


      </div>

    );

  }


  return children;

}