"use client";


import {
  useEffect,
  useState,
} from "react";


import MedicineSearchBox from "./MedicineSearchBox";

import PendingMedicineUpdates from "./PendingMedicineUpdates";

import UpdateConfirmModal from "./UpdateConfirmModal";




export default function Medicine(){



  const [
    pendingMedicines,
    setPendingMedicines
  ] = useState([]);



  const [
    loading,
    setLoading
  ] = useState(true);



  const [
    showConfirm,
    setShowConfirm
  ] = useState(false);






  // =========================
  // GET PENDING UPDATES
  // =========================


  async function getPending(){


    try{


      const res =
        await fetch(

          "/api/software/medicine-updates",

          {
            cache:"no-store"
          }

        );



      const data =
        await res.json();




      if(data.success){


        setPendingMedicines(

          data.updates || []

        );


      }



    }

    catch(error){


      console.log(
        "Pending Load Error",
        error
      );


    }

    finally{


      setLoading(false);


    }


  }








  useEffect(()=>{


    getPending();


  },[]);









  // =========================
  // ADD PENDING UPDATE
  // =========================


  async function addPending(data){



    try{


      const res =
        await fetch(

          "/api/software/medicine-updates/add",

          {

            method:"POST",

            headers:{

              "Content-Type":
              "application/json"

            },


            body:
            JSON.stringify(data)


          }

        );





      const result =
        await res.json();





      if(!result.success){


        alert(

          result.message ||

          "Failed to add"

        );


        return;

      }





      getPending();




    }

    catch(error){


      console.log(
        error
      );


    }


  }









  // =========================
  // REMOVE FROM UI AFTER DELETE
  // =========================


  function removePending(item){



    setPendingMedicines(prev =>

      prev.filter(

        x =>
        x._id !== item._id

      )

    );


  }









  // =========================
  // EDIT FUTURE
  // =========================


  function editPending(item){


    console.log(
      "Edit Pending",
      item
    );


  }









  // =========================
  // OPEN CONFIRM MODAL
  // =========================


  function updateAll(){


    if(
      pendingMedicines.length === 0
    ){

      return;

    }



    setShowConfirm(true);


  }









  // =========================
  // CONFIRM UPDATE
  // =========================


  async function confirmUpdate(){


    try{


      const res =
        await fetch(

          "/api/software/medicine-updates/update-all",

          {

            method:"POST"

          }

        );





      const data =
        await res.json();





      alert(

        data.message

      );





      setShowConfirm(false);



      getPending();




    }

    catch(error){


      console.log(
        error
      );


    }


  }










  return (

    <div
      className="
      min-h-screen
      bg-slate-50
      p-4
      sm:p-6
      "
    >



      <div
        className="
        mx-auto
        max-w-5xl
        space-y-6
        "
      >




        {/* HEADER */}


        <div
          className="
          rounded-2xl
          bg-white
          p-6
          shadow-sm
          "
        >


          <div
            className="
            flex
            items-center
            gap-3
            "
          >


            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-[#123B6D]
              text-xl
              text-white
              "
            >

              💊

            </div>




            <div>


              <h1
                className="
                text-2xl
                font-bold
                text-[#123B6D]
                "
              >

                Medicine Management

              </h1>



              <p
                className="
                mt-1
                text-sm
                text-slate-500
                "
              >

                Add medicines and review price updates

              </p>



            </div>



          </div>


        </div>









        {/* ADD / SEARCH */}


        <div
          className="
          rounded-2xl
          bg-white
          p-5
          shadow-sm
          "
        >



          <MedicineSearchBox

            onAddPending={
              addPending
            }

          />



        </div>









        {/* PENDING */}



        <PendingMedicineUpdates


          medicines={
            pendingMedicines
          }



          onDelete={
            removePending
          }



          onEdit={
            editPending
          }



          onUpdateAll={
            updateAll
          }



        />









        {/* CONFIRM MODAL */}


        <UpdateConfirmModal


          open={
            showConfirm
          }



          medicines={
            pendingMedicines
          }



          onClose={()=>


            setShowConfirm(false)


          }



          onConfirm={
            confirmUpdate
          }



        />





      </div>



    </div>

  );

}