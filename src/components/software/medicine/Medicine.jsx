"use client";


import {
  useEffect,
  useState,
} from "react";


import MedicineSearchBox from "./MedicineSearchBox";

import PendingMedicineUpdates from "./PendingMedicineUpdates";

import EditMedicineUpdate from "./EditMedicineUpdate";





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
    editMedicine,
    setEditMedicine
  ] = useState(null);




  const [
    editOpen,
    setEditOpen
  ] = useState(false);









  // =========================
  // LOAD PENDING UPDATES
  // =========================


  async function getPending(){


    try{


      const res = await fetch(

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

      else{


        setPendingMedicines([]);


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
  // ADD PENDING
  // =========================


  async function addPending(data){



    try{


      const res = await fetch(

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





      if(result.success){


        getPending();


      }



    }

    catch(error){


      console.log(

        "Add Pending Error",

        error

      );


    }


  }









  // =========================
  // REMOVE AFTER DELETE
  // =========================


  function removePending(item){


    setPendingMedicines(prev =>


      prev.filter(

        medicine =>

        medicine._id !== item._id


      )


    );


  }









  // =========================
  // OPEN EDIT
  // =========================


  function editPending(item){



    setEditMedicine(item);


    setEditOpen(true);



  }









  // =========================
  // CLOSE EDIT
  // =========================


  function closeEdit(){


    setEditOpen(false);


    setEditMedicine(null);



  }









  return (


    <main

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



        <section

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

                Manage medicines and review updates

              </p>



            </div>



          </div>



        </section>









        {/* SEARCH BOX */}



        <section

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



        </section>









        {/* PENDING LIST */}



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
            getPending
          }



        />









        {/* EDIT MODAL */}



        <EditMedicineUpdate


          medicine={
            editMedicine
          }



          open={
            editOpen
          }



          onClose={
            closeEdit
          }



          onUpdated={
            getPending
          }



        />





      </div>





    </main>


  );


}