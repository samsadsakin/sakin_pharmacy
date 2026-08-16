"use client";


export default function MedicineCard({

  medicine,

  onDelete,

  onEdit

}) {


  return (

    <div
      className="
      rounded-xl
      border
      bg-white
      p-4
      shadow-sm
      "
    >


      <div className="flex items-start justify-between gap-4">


        <div>


          <h3 className="font-semibold text-slate-800">

            {medicine.medicineName}

          </h3>



          {
            medicine.type === "new_medicine" ? (

              <p className="mt-1 text-sm text-green-600">

                New Medicine

              </p>

            ) : (


              <p className="mt-1 text-sm text-blue-600">

                Price Update

              </p>


            )

          }



        </div>





        <div className="text-right">


          {
            medicine.type === "price_update" && (

              <>

                <p className="text-xs text-slate-400">
                  Old Price
                </p>


                <p className="text-sm line-through text-slate-500">

                  {medicine.oldPrice}

                </p>


              </>
          )}





          <p className="mt-1 text-lg font-bold text-slate-800">

            {medicine.newPrice}

          </p>


        </div>



      </div>





      <div
        className="
        mt-4
        flex
        gap-2
        "
      >


        <button

          onClick={()=>
            onEdit(medicine)
          }

          className="
          rounded-lg
          bg-blue-50
          px-4
          py-2
          text-sm
          font-medium
          text-blue-700
          hover:bg-blue-100
          "

        >

          Edit

        </button>





        <button

          onClick={()=>
            onDelete(medicine)
          }


          className="
          rounded-lg
          bg-red-50
          px-4
          py-2
          text-sm
          font-medium
          text-red-600
          hover:bg-red-100
          "

        >

          Remove

        </button>



      </div>



    </div>

  );

}