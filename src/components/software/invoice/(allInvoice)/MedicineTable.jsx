"use client";


import {
  Th,
  Td,
} from "./InvoiceUtils";



export default function MedicineTable({

  rows,

  deleteMedicine,

}) {



  const money = (value) =>
    Number(value || 0).toFixed(2);




  const getAmount = (row) => {


    const qty =
      Number(row.qty || 0);


    const rate =
      Number(row.rate || 0);


    const dis =
      Number(row.dis || 0);



    return (
      qty *
      rate *
      (
        1 - dis / 100
      )
    );


  };





  return (


    <div
      className="
      mb-5
      overflow-x-auto
      rounded-xl
      bg-white
      shadow-sm
      "
    >



      <table
        className="
        w-full
        min-w-160
        text-xs
        "
      >



        <thead
          className="
          bg-[#123B6D]
          text-white
          "
        >


          <tr>


            <Th className="text-center">
              SL
            </Th>



            <Th>
              Medicine
            </Th>



            <Th className="text-right">
              Qty
            </Th>



            <Th className="text-right">
              Rate
            </Th>



            <Th className="text-right">
              Dis
            </Th>



            <Th className="text-right">
              Amount
            </Th>



            <Th className="text-center">
              ✕
            </Th>


          </tr>


        </thead>







        <tbody>


          {
            rows.length === 0 ? (


              <tr>

                <td

                  colSpan={7}

                  className="
                py-8
                text-center
                text-sm
                text-slate-400
                "

                >

                  No medicine added

                </td>


              </tr>


            )


              :


              rows.map(
                (row, index) => (



                  <tr

                    key={row.id}

                    className="
                border-b
                border-slate-100
                transition
                hover:bg-slate-50
                "

                  >





                    <Td className="
                  text-center
                  text-slate-400
                ">

                      {index + 1}

                    </Td>







                    <Td>


                      <div
                        className="
                                  max-w-xs
                                   font-medium
                             text-slate-700
                                            "
                        style={{
                          wordBreak: "break-word",
                        }}
                      >

                        {row.medicine || "-"}

                      </div>


                    </Td>







                    <Td className="
                  text-right
                  font-medium
                ">

                      {row.qty}

                    </Td>







                    <Td className="
                  text-right
                ">


                      ৳ {money(row.rate)}


                    </Td>








                    <Td className="
                  text-right
                ">


                      {row.dis || 0}%


                    </Td>







                    <Td className="
                  text-right
                  font-bold
                  text-[#123B6D]
                ">


                      ৳ {money(
                        getAmount(row)
                      )}


                    </Td>







                    <Td className="
                  text-center
                ">



                      <button

                        type="button"


                        onClick={() =>
                          deleteMedicine(
                            row.id
                          )
                        }



                        className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    text-red-500
                    transition
                    hover:bg-red-50
                    "

                      >

                        ×

                      </button>



                    </Td>






                  </tr>



                )

              )

          }



        </tbody>




      </table>




    </div>


  );


}