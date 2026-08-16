"use client";


export default function UpdateConfirmModal({

  open,

  medicines,

  onClose,

  onConfirm

}) {


  if(!open){
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
      px-4
      "
    >


      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-6
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

          Confirm Updates

        </h2>




        <p
          className="
          mt-1
          text-sm
          text-slate-500
          "
        >

          Are you sure you want to update these medicines?

        </p>







        <div
          className="
          mt-5
          max-h-64
          space-y-3
          overflow-y-auto
          "
        >


          {
            medicines.map((item,index)=>(


              <div

                key={index}

                className="
                rounded-xl
                bg-slate-50
                p-3
                "

              >


                <p
                  className="
                  font-semibold
                  text-slate-800
                  "
                >

                  {item.medicineName}

                </p>




                {
                  item.type ===
                  "price_update"

                  ?

                  <p
                    className="
                    mt-1
                    text-sm
                    text-blue-600
                    "
                  >

                    {item.oldPrice}
                    {" → "}
                    {item.newPrice}

                  </p>


                  :

                  <p
                    className="
                    mt-1
                    text-sm
                    text-green-600
                    "
                  >

                    New Medicine
                    {" "}
                    ৳{item.newPrice}

                  </p>


                }



              </div>


            ))
          }


        </div>







        <div
          className="
          mt-6
          flex
          justify-end
          gap-3
          "
        >


          <button

            onClick={onClose}

            className="
            rounded-xl
            bg-slate-100
            px-5
            py-2.5
            text-sm
            font-semibold
            text-slate-600
            "

          >

            Cancel

          </button>





          <button

            onClick={onConfirm}


            className="
            rounded-xl
            bg-[#20A44A]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            "

          >

            Confirm Update

          </button>



        </div>



      </div>



    </div>

  );

}