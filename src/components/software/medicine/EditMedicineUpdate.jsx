"use client";


import {
  useEffect,
  useState,
} from "react";


import Swal from "sweetalert2";





export default function EditMedicineUpdate({

  medicine,

  open,

  onClose,

  onUpdated

}) {



  const [name, setName] =
    useState("");


  const [price, setPrice] =
    useState("");



  const [loading, setLoading] =
    useState(false);







  useEffect(() => {


    if (medicine) {


      setName(
        medicine.medicineName || ""
      );


      setPrice(
        medicine.newPrice || ""
      );


    }


  }, [medicine]);











  async function handleSave() {



    if (!name || !price) {


      Swal.fire({

        title: "Required",

        text: "Medicine name and price required",

        icon: "warning"

      });


      return;


    }







    try {


      setLoading(true);






      const res =

        await fetch(

          "/api/software/medicine-updates/edit",

          {


            method: "PUT",


            headers: {


              "Content-Type":

                "application/json"


            },


            body: JSON.stringify({


              id: medicine._id,


              medicineName: name,


              newPrice: Number(price)



            })


          }

        );







      const data =

        await res.json();








      if (data.success) {



        Swal.fire({

          title: "Updated",

          text: "Medicine update saved",

          icon: "success",

          timer: 1200,

          showConfirmButton: false

        });



        onUpdated();


        onClose();



      }


      else {


        Swal.fire({

          title: "Failed",

          text:
            data.message ||
            "Update failed",

          icon: "error"

        });


      }







    }

    catch (error) {


      console.log(error);



      Swal.fire({

        title: "Error",

        text: "Something went wrong",

        icon: "error"

      });



    }

    finally {


      setLoading(false);


    }


  }









  if (!open) {

    return null;

  }









  return (


    <div

      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      p-4
      "

    >




      <div

        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-5
        shadow-xl
        "

      >




        <h2

          className="
          text-lg
          font-bold
          text-[#123B6D]
          "

        >

          Edit Medicine Update

        </h2>








        <div

          className="
          mt-4
          space-y-3
          "

        >



          <input
            value={name}
            readOnly
            className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            placeholder="Medicine name"
          />





          <input


            type="number"


            value={price}


            onChange={(e) =>
              setPrice(e.target.value)
            }


            className="
            w-full
            rounded-lg
            border
            px-3
            py-2
            text-sm
            "

            placeholder="Price"

          />




        </div>









        <div

          className="
          mt-5
          flex
          gap-2
          "

        >



          <button


            type="button"


            onClick={onClose}


            className="
            flex-1
            rounded-lg
            bg-slate-100
            py-2
            text-sm
            font-medium
            "

          >

            Cancel

          </button>







          <button


            type="button"


            onClick={handleSave}


            disabled={loading}


            className="
            flex-1
            rounded-lg
            bg-[#123B6D]
            py-2
            text-sm
            font-medium
            text-white
            "

          >


            {
              loading
                ?
                "Saving..."
                :
                "Save"
            }


          </button>





        </div>





      </div>




    </div>


  );


}