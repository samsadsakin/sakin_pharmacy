"use client";

import { useState } from "react";

import MedicineCard from "./MedicineCard";



export default function PendingMedicineUpdates({

  medicines,

  onDelete,

  onEdit,

  onUpdateAll

}) {


  const [deleting,setDeleting] =
    useState(null);



  // =========================
  // DELETE PENDING UPDATE
  // =========================

  async function handleDelete(item){


    const confirmDelete =
      window.confirm(
        "Remove this medicine update?"
      );


    if(!confirmDelete){
      return;
    }



    try{


      setDeleting(
        item._id
      );



      const res =
        await fetch(

          "/api/software/medicine-updates/delete",

          {

            method:"DELETE",

            headers:{

              "Content-Type":
              "application/json"

            },


            body:JSON.stringify({

              id:item._id

            })


          }

        );



      const data =
        await res.json();





      if(data.success){


        onDelete(item);


      }
      else{


        alert(
          data.message ||
          "Delete failed"
        );


      }




    }

    catch(error){


      console.log(
        error
      );


      alert(
        "Something went wrong"
      );


    }

    finally{


      setDeleting(null);


    }



  }







  return (

    <div className="
      rounded-2xl
      bg-white
      p-5
      shadow-sm
    ">



      {/* HEADER */}

      <div className="
        mb-5
        flex
        items-center
        justify-between
      ">


        <div>


          <h2 className="
            text-lg
            font-bold
            text-[#123B6D]
          ">

            Pending Medicine Changes

          </h2>



          <p className="
            mt-1
            text-xs
            text-slate-500
          ">

            Review medicine updates before applying

          </p>


        </div>







        {
          medicines.length > 0 && (


            <button

              onClick={onUpdateAll}


              className="
              rounded-xl
              bg-[#20A44A]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-700
              "

            >

              Update All

            </button>


          )
        }



      </div>







      {/* EMPTY */}

      {
        medicines.length === 0 ? (


          <div className="
            rounded-xl
            bg-slate-50
            p-8
            text-center
          ">


            <p className="
              text-sm
              text-slate-500
            ">

              No pending medicine changes

            </p>


          </div>



        )

        :



        (


          <div className="
            space-y-4
          ">


            {
              medicines.map(
                (medicine)=>(


                  <MedicineCard


                    key={
                      medicine._id
                    }


                    medicine={
                      medicine
                    }



                    onDelete={
                      handleDelete
                    }



                    onEdit={
                      onEdit
                    }


                  />


                )
              )
            }



          </div>


        )

      }





    </div>

  );

}