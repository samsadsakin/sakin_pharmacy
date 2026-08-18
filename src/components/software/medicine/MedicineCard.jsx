"use client";


export default function MedicineCard({

  medicine,

  onDelete,

  onEdit,

}) {



  return (


    <div

      className="
      rounded-xl
      border
      border-slate-100
      bg-white
      p-4
      shadow-sm
      "

    >







      <div

        className="
        flex
        items-start
        justify-between
        gap-4
        "

      >






        {/* LEFT SIDE */}


        <div

          className="
          min-w-0
          "

        >




          <h3

            className="
            truncate
            font-semibold
            text-slate-800
            "

          >

            {medicine.medicineName}

          </h3>







          <span

            className={`
            mt-2
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium

            ${
              medicine.type === "new_medicine"

              ?

              "bg-green-50 text-green-700"

              :

              "bg-blue-50 text-blue-700"

            }

            `}

          >


            {
              medicine.type === "new_medicine"

              ?

              "New Medicine"

              :

              "Price Update"

            }



          </span>






        </div>









        {/* PRICE */}


        <div

          className="
          text-right
          "

        >





          {
            medicine.type === "price_update" && (


              <>

                <p

                  className="
                  text-xs
                  text-slate-400
                  "

                >

                  Old Price

                </p>




                <p

                  className="
                  text-sm
                  text-slate-400
                  line-through
                  "

                >

                  ৳ {medicine.oldPrice}

                </p>



              </>


            )

          }







          <p

            className="
            mt-1
            text-lg
            font-bold
            text-[#123B6D]
            "

          >

            ৳ {medicine.newPrice}

          </p>






        </div>







      </div>









      {/* CREATED INFO */}


      <div

        className="
        mt-4
        rounded-lg
        bg-slate-50
        px-3
        py-2
        text-xs
        text-slate-500
        "

      >



        <div

          className="
          flex
          justify-between
          "

        >


          <span>

            Added By

          </span>



          <span

            className="
            font-medium
            text-slate-700
            "

          >

            {
              medicine.createdBy?.name || "-"
            }

          </span>



        </div>







        <div

          className="
          mt-1
          flex
          justify-between
          "

        >


          <span>

            Mobile

          </span>



          <span

            className="
            font-medium
            text-slate-700
            "

          >

            {
              medicine.createdBy?.mobile || "-"
            }

          </span>



        </div>




      </div>









      {/* ACTION */}



      <div

        className="
        mt-4
        flex
        gap-2
        "

      >





        <button


          type="button"


          onClick={() =>
            onEdit(medicine)
          }



          className="
          flex-1
          rounded-lg
          bg-blue-50
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


          type="button"


          onClick={() =>
            onDelete(medicine)
          }



          className="
          flex-1
          rounded-lg
          bg-red-50
          py-2
          text-sm
          font-medium
          text-red-600
          hover:bg-red-100
          "

        >

          Delete

        </button>






      </div>







    </div>


  );


}