"use client";

import {
  useEffect,
  useState
} from "react";


export default function MedicineInput({

  value,

  onChange,

  onSelect

}) {


  const [search,setSearch] =
    useState(value || "");


  const [results,setResults] =
    useState([]);




  useEffect(()=>{


    setSearch(value || "");


  },[value]);






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



      },300);



    return ()=>clearTimeout(timer);



  },[search]);









  function selectMedicine(item){



    setSearch(
      item.name
    );


    setResults([]);



    onSelect({

      name:item.name,

      price:item.salePrice

    });



  }






  return (

    <div className="relative">


      <input

        value={search}


        onChange={(e)=>{


          setSearch(
            e.target.value
          );


          onChange(
            e.target.value
          );


        }}



        placeholder="Medicine name"


        className="
        w-full
        rounded-lg
        border
        px-3
        py-2
        text-sm
        outline-none
        focus:border-[#123B6D]
        "

      />






      {
        results.length > 0 && (


          <div
            className="
            absolute
            z-50
            mt-1
            w-full
            rounded-lg
            bg-white
            shadow-lg
            "
          >


            {
              results.map(item=>(


                <button

                  key={item._id}

                  type="button"

                  onClick={()=>selectMedicine(item)}


                  className="
                  flex
                  w-full
                  justify-between
                  px-3
                  py-2
                  text-left
                  hover:bg-blue-50
                  "

                >


                  <span>

                    {item.name}

                  </span>


                  <span className="
                    font-semibold
                  ">

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