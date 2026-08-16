"use client";

import { useEffect, useState } from "react";


export default function MedicineSearchBox({
  onAddPending
}) {


  const [search,setSearch] =
    useState("");

  const [results,setResults] =
    useState([]);


  const [selectedMedicine,setSelectedMedicine] =
    useState(null);


  const [price,setPrice] =
    useState("");



  // =========================
  // SEARCH
  // =========================

  useEffect(()=>{


    if(!search.trim()){

      setResults([]);

      return;

    }



    const timer =
      setTimeout(async()=>{


        try{


          const res =
            await fetch(
              `/api/software/medicines/search?q=${search}`
            );


          const data =
            await res.json();



          if(data.success){

            setResults(
              data.medicines
            );

          }



        }
        catch(error){

          console.log(error);

        }



      },400);



    return ()=>clearTimeout(timer);



  },[search]);









  function selectMedicine(item){


    setSelectedMedicine(item);


    setSearch(
      item.name
    );


    setPrice(
      item.salePrice
    );


    setResults([]);


  }







  function handleAdd(){


    if(!search.trim()){

      return;

    }



    // Existing medicine

    if(selectedMedicine){



      if(
        Number(price)
        ===
        Number(
          selectedMedicine.salePrice
        )
      ){

        alert(
          "Price is already same. No update required."
        );

        return;

      }





      onAddPending({

        type:"price_update",

        medicineId:
        selectedMedicine._id,


        medicineName:
        selectedMedicine.name,


        oldPrice:
        selectedMedicine.salePrice,


        newPrice:
        Number(price)

      });



    }



    // New medicine


    else{


      onAddPending({

        type:"new_medicine",

        medicineName:
        search,


        oldPrice:null,


        newPrice:
        Number(price)

      });



    }





    setSearch("");

    setPrice("");

    setSelectedMedicine(null);


  }






  return (

    <div>


      <h2 className="
        mb-4
        text-lg
        font-semibold
        text-[#123B6D]
      ">

        Add / Update Medicine

      </h2>





      {/* Search */}

      <div className="relative">


        <input

          value={search}


          onChange={(e)=>{

            setSearch(
              e.target.value
            );

            setSelectedMedicine(null);

          }}


          placeholder="
          Search medicine name...
          "


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






        {
          results.length > 0 && (

            <div
              className="
              absolute
              z-30
              mt-2
              w-full
              overflow-hidden
              rounded-xl
              bg-white
              shadow-lg
              ring-1
              ring-slate-100
              "
            >


              {
                results.map((item)=>(


                  <button

                    key={item._id}

                    type="button"

                    onClick={()=>
                      selectMedicine(item)
                    }


                    className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-3
                    text-left
                    hover:bg-blue-50
                    "

                  >


                    <span className="
                      text-sm
                      font-medium
                      text-slate-700
                    ">

                      {item.name}

                    </span>



                    <span className="
                      rounded-full
                      bg-green-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-green-700
                    ">

                      ৳ {item.salePrice}

                    </span>



                  </button>


                ))
              }


            </div>


          )
        }


      </div>








      {/* Selected medicine */}

      {
        selectedMedicine && (


          <div className="
            mt-4
            rounded-xl
            bg-blue-50
            p-4
          ">


            <p className="
              text-xs
              font-medium
              text-blue-600
            ">

              Existing Medicine Found

            </p>


            <p className="
              mt-1
              font-semibold
              text-slate-800
            ">

              {selectedMedicine.name}

            </p>


            <p className="
              mt-1
              text-sm
              text-slate-500
            ">

              Current Price:
              ৳ {selectedMedicine.salePrice}

            </p>


          </div>


        )

      }








      {/* Price */}

      <div className="mt-5">


        <label className="
          text-sm
          font-medium
          text-slate-600
        ">

          New Price

        </label>


        <input

          type="number"

          value={price}


          onChange={(e)=>
            setPrice(e.target.value)
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







      <button

        onClick={handleAdd}


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
        hover:bg-[#0d2d55]
        "

      >

        Add To Pending

      </button>




    </div>

  );

}