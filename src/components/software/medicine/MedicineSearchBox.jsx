"use client";

import {
  useEffect,
  useState,
} from "react";


export default function MedicineSearchBox({
  onAddPending,
}) {


  const [search, setSearch] =
    useState("");


  const [results, setResults] =
    useState([]);


  const [
    selectedMedicine,
    setSelectedMedicine
  ] = useState(null);


  const [price, setPrice] =
    useState("");





  // =========================
  // SEARCH
  // =========================

  useEffect(() => {


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


      }, 400);



    return () =>
      clearTimeout(timer);


  }, [search]);







  // =========================
  // SELECT MEDICINE
  // =========================

  function selectMedicine(item) {


    setSelectedMedicine(
      item
    );


    setSearch(
      item.name
    );


    setPrice(
      item.salePrice
    );


    setResults([]);


  }







  // =========================
  // ADD TO PENDING
  // =========================

  function handleAdd() {


    if (!search.trim()) {

      return;

    }



    if (
      price === "" ||
      Number(price) < 0
    ) {

      return;

    }





    // =========================
    // EXISTING MEDICINE
    // =========================

    if (selectedMedicine) {


      if (
        Number(price) ===
        Number(
          selectedMedicine.salePrice
        )
      ) {


        alert(
          "Price is already same. No update required."
        );


        return;

      }





      onAddPending({

        type:
          "price_update",


        medicineId:
          selectedMedicine._id,


        medicineName:
          selectedMedicine.name,


        oldPrice:
          selectedMedicine.salePrice,


        newPrice:
          Number(price),

      });


    }



    // =========================
    // NEW MEDICINE
    // =========================

    else {


      onAddPending({

        type:
          "new_medicine",


        medicineName:
          search.trim(),


        oldPrice:
          null,


        newPrice:
          Number(price),

      });


    }





    // RESET

    setSearch("");

    setPrice("");

    setSelectedMedicine(null);

    setResults([]);


  }







  return (

    <div>


      <h2
        className="
        mb-4
        text-lg
        font-semibold
        text-[#123B6D]
        "
      >

        Add / Update Medicine

      </h2>





      {/* =========================
          SEARCH
      ========================= */}

      <div className="relative">


        <input

          value={search}

          onChange={(e) => {


            setSearch(
              e.target.value
            );


            setSelectedMedicine(
              null
            );


            setPrice("");


          }}

          placeholder="Search medicine name..."

          autoComplete="off"

          className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          outline-none
          transition
          focus:border-[#123B6D]
          focus:bg-white
          "

        />







        {/* =========================
            SEARCH RESULT

            MOBILE = TOP
            TABLET / PC = RIGHT
        ========================= */}

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
              rounded-xl
              bg-white
              p-1
              shadow-lg
              ring-1
              ring-slate-100

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
                    transition
                    hover:bg-blue-50
                    "
                  >


                    <span
                      className="
                      min-w-0
                      flex-1
                      text-sm
                      font-medium
                      text-slate-700
                      "
                    >

                      {item.name}

                    </span>



                    <span
                      className="
                      shrink-0
                      rounded-full
                      bg-green-50
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-green-700
                      "
                    >

                      ৳ {item.salePrice}

                    </span>


                  </button>

                ))
              }


            </div>

          )
        }


      </div>








      {/* =========================
          SELECTED MEDICINE
      ========================= */}

      {
        selectedMedicine && (

          <div
            className="
            mt-4
            rounded-xl
            bg-blue-50
            p-4
            "
          >


            <p
              className="
              text-xs
              font-medium
              text-blue-600
              "
            >

              Existing Medicine Found

            </p>


            <p
              className="
              mt-1
              font-semibold
              text-slate-800
              "
            >

              {selectedMedicine.name}

            </p>


            <p
              className="
              mt-1
              text-sm
              text-slate-500
              "
            >

              Current Price: ৳ {selectedMedicine.salePrice}

            </p>


          </div>

        )
      }








      {/* =========================
          PRICE
      ========================= */}

      <div className="mt-5">


        <label
          className="
          text-sm
          font-medium
          text-slate-600
          "
        >

          {
            selectedMedicine
              ? "New Price"
              : "Price"
          }

        </label>



        <input

          type="number"

          value={price}

          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }

          className="
          mt-2
          w-full
          rounded-xl
          border
          border-slate-200
          px-4
          py-3
          text-sm
          outline-none
          focus:border-[#123B6D]
          "

        />


      </div>








      {/* =========================
          BUTTON
      ========================= */}

      <button

        type="button"

        onClick={
          handleAdd
        }

        className="
        mt-5
        w-full
        rounded-xl
        bg-[#123B6D]
        py-3
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-blue-900
        "
      >

        {
          selectedMedicine
            ? "Add Price Update"
            : "Add New Medicine"
        }

      </button>


    </div>

  );

}