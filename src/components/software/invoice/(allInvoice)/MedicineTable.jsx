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

    <div className="mb-6 overflow-x-auto rounded-xl shadow-sm ring-1 ring-slate-100">


      <table className="w-full text-sm">


        <thead className="bg-sky-50 text-slate-600">


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
              Dis %
            </Th>


            <Th className="text-right">
              Amount
            </Th>


            <Th className="text-center">
              Action
            </Th>


          </tr>


        </thead>




        <tbody>


          {
            rows.length === 0 ? (


              <tr>

                <td

                  colSpan={7}

                  className="py-10 text-center text-slate-400"

                >

                  No medicine added

                </td>


              </tr>


            )

            :

            rows.map(
              (row,index)=>(


                <tr

                  key={row.id}

                  className="border-b border-slate-100 hover:bg-slate-50"

                >


                  <Td className="text-center text-slate-400">

                    {index + 1}

                  </Td>




                  <Td className="font-medium">

                    {row.medicine}

                  </Td>




                  <Td className="text-right">

                    {row.qty}

                  </Td>




                  <Td className="text-right">

                    {money(row.rate)}

                  </Td>




                  <Td className="text-right">

                    {row.dis || 0}%

                  </Td>




                  <Td className="text-right font-semibold text-sky-800">

                    {money(
                      getAmount(row)
                    )}

                  </Td>




                  <Td className="text-center">


                    <button

                      type="button"

                      onClick={() =>
                        deleteMedicine(row.id)
                      }

                      className="rounded px-2 py-1 text-red-500 hover:bg-red-50"

                    >

                      ✕

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