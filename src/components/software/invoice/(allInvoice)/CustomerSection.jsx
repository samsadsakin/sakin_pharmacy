"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  Field,
} from "./InvoiceUtils";


export default function CustomerSection({

  customer,

  setCustomer,

}) {


  const autoFilledName =
    useRef("");


  // =========================
  // FIND CUSTOMER BY MOBILE
  // =========================

  useEffect(() => {


    const mobile =
      String(
        customer.phone || ""
      )
        .replace(/\D/g, "")
        .trim();



    // 11 digit না হলে search করবে না
    if (mobile.length !== 11) {


      // আগের auto-filled name হলে clear করবে
      if (
        autoFilledName.current &&
        customer.name === autoFilledName.current
      ) {

        setCustomer((prev) => ({

          ...prev,

          name: "",

        }));


        autoFilledName.current = "";

      }


      return;

    }



    const timer =
      setTimeout(async () => {


        try {


          const res =
            await fetch(

              `/api/software/users/by-mobile?mobile=${encodeURIComponent(
                mobile
              )}`,

              {
                cache: "no-store",
              }

            );



          const data =
            await res.json();



          // =========================
          // USER FOUND
          // =========================

          if (
            data.success &&
            data.user
          ) {


            autoFilledName.current =
              data.user.name || "";


            setCustomer((prev) => ({

              ...prev,

              name:
                data.user.name || "",

            }));


            return;

          }



          // =========================
          // USER NOT FOUND
          // =========================

          if (
            autoFilledName.current &&
            customer.name === autoFilledName.current
          ) {


            setCustomer((prev) => ({

              ...prev,

              name: "",

            }));


            autoFilledName.current = "";

          }


        }

        catch(error) {


          console.log(
            "Customer Search Error:",
            error
          );


        }


      }, 300);



    return () =>
      clearTimeout(timer);


  }, [
    customer.phone,
  ]);





  return (

    <section className="mb-6 space-y-3">


      <div className="grid gap-3 md:grid-cols-2">


        {/* NAME */}

        <Field

          label="Name"

          placeholder="Customer Name"

          value={
            customer.name
          }

          onChange={(e) => {


            autoFilledName.current = "";


            setCustomer({

              ...customer,

              name:
                e.target.value,

            });


          }}

        />





        {/* MORE INFO */}

        <Field

          label="More Info"

          placeholder="More Information"

          value={
            customer.moreInfo
          }

          onChange={(e) =>

            setCustomer({

              ...customer,

              moreInfo:
                e.target.value,

            })

          }

        />


      </div>





      {/* PHONE */}

      <Field

        label="Phone Number"

        placeholder="Phone Number"

        value={
          customer.phone
        }

        onChange={(e) => {


          const value =
            e.target.value;


          setCustomer({

            ...customer,

            phone:
              value,

          });


        }}

      />


    </section>

  );

}