"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";


export default function MedicineSearchInput({

  value,

  onChange,

  onSelect,

}) {


  const [search, setSearch] =
    useState(value || "");


  const [results, setResults] =
    useState([]);


  const skipSearch =
    useRef(false);





  // =========================
  // SYNC VALUE
  // =========================

  useEffect(() => {

    setSearch(
      value || ""
    );

  }, [value]);





  // =========================
  // SEARCH MEDICINE
  // =========================

  useEffect(() => {


    if (skipSearch.current) {

      skipSearch.current = false;

      return;

    }



    if (!search.trim()) {

      setResults([]);

      return;

    }



    const timer =
      setTimeout(async () => {


        try {


          const res =
            await fetch(

              `/api/software/medicines/search?q=${encodeURIComponent(
                search
              )}`,

              {
                cache: "no-store",
              }

            );



          const data =
            await res.json();



          if (data.success) {

            setResults(
              data.medicines || []
            );

          }

          else {

            setResults([]);

          }


        }

        catch (error) {


          console.log(
            "Medicine Search Error:",
            error
          );


          setResults([]);


        }


      }, 300);



    return () =>
      clearTimeout(timer);


  }, [search]);





  // =========================
  // SELECT MEDICINE
  // =========================

  function selectMedicine(item) {


    skipSearch.current = true;


    setSearch(
      item.name
    );


    setResults([]);



    onSelect({

      id:
        item._id,

      name:
        item.name,

      price:
        item.salePrice,

    });


  }





  return (

    <div className="relative w-full">


      {/* INPUT */}

      <input

        value={search}

        onChange={(e) => {


          const newValue =
            e.target.value;


          setSearch(
            newValue
          );


          onChange(
            newValue
          );


        }}

        placeholder="Medicine name"

        autoComplete="off"

        className="
        h-10
        w-full
        rounded-lg
        border
        border-slate-200
        bg-white
        px-3
        text-sm
        outline-none
        transition
        focus:border-[#123B6D]
        "

      />





      {/* SEARCH RESULTS */}

      {
        results.length > 0 && (

          <div
            className="
            absolute
            bottom-full
            left-0
            z-50
            mb-2
            max-h-64
            w-full
            overflow-y-auto
            rounded-lg
            bg-white
            p-1
            shadow-lg

            md:bottom-auto
            md:left-full
            md:top-0
            md:mb-0
            md:ml-3
            md:w-80
            "
          >


            {
              results.map((item) => (

                <button

                  key={item._id}

                  type="button"

                  onClick={() =>
                    selectMedicine(item)
                  }

                  className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  transition
                  hover:bg-blue-50
                  "
                >


                  <span className="text-slate-700">

                    {item.name}

                  </span>


                  <span
                    className="
                    shrink-0
                    font-semibold
                    text-green-700
                    "
                  >

                    {item.salePrice}

                  </span>


                </button>

              ))
            }


          </div>

        )
      }


    </div>

  );

}