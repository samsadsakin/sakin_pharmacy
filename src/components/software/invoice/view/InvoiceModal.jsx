"use client";


import {
  money,
  formatDate,

} from "@/components/software/invoice/ViewInvoiceComponents";



export default function InvoiceModal({

  invoice,

  onClose,

}) {


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">


      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">



        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-4 py-4">


          <div>

            <h2 className="font-semibold text-sky-700">

              Invoice #{invoice.invoiceNo}

            </h2>


            <p className="text-xs text-slate-400">

              {formatDate(invoice.date)}

            </p>


          </div>



          <button

            type="button"

            onClick={onClose}

            className="rounded-lg px-3 py-1 hover:bg-slate-100"

          >

            ✕

          </button>


        </div>





        {/* SELLER */}

        <div className="mx-4 mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">


          <span className="font-semibold">

            Seller:

          </span>


          {" "}


          {invoice.seller?.name || "N/A"}


        </div>







        {/* CUSTOMER */}

        <div className="mx-4 mt-4 space-y-2">


          <InfoRow

            label="Name"

            value={
              invoice.customer?.name || "N/A"
            }

          />


          <InfoRow

            label="Phone"

            value={
              invoice.customer?.phone || "N/A"
            }

          />


          <InfoRow

            label="More Info"

            value={
              invoice.customer?.moreInfo || "N/A"
            }

          />


        </div>









        {/* MEDICINE TABLE */}


        <div className="mt-5 overflow-x-auto px-4">


          <table className="w-full min-w-96 text-sm">


            <thead className="bg-sky-50">


              <tr>


                <th className="px-3 py-2 text-left">
                  Medicine
                </th>


                <th className="px-3 py-2">
                  Qty
                </th>


                <th className="px-3 py-2">
                  Rate
                </th>


                <th className="px-3 py-2">
                  Dis %
                </th>


                <th className="px-3 py-2">
                  Amount
                </th>


              </tr>


            </thead>



            <tbody>


              {
                invoice.medicines?.map(

                  (medicine,index)=>(


                    <tr

                      key={index}

                      className="border-b"

                    >


                      <td className="px-3 py-2">

                        {medicine.medicine}

                      </td>



                      <td className="text-center">

                        {medicine.qty}

                      </td>



                      <td className="text-center">

                        {money(medicine.rate)}

                      </td>



                      <td className="text-center">

                        {medicine.percentageDiscount || 0}%

                      </td>



                      <td className="text-center font-semibold text-sky-700">

                        {money(medicine.amount)}

                      </td>


                    </tr>


                  )

                )

              }


            </tbody>


          </table>


        </div>








        {/* TOTAL */}


        <div className="mx-4 my-4 rounded-xl bg-slate-50 p-4">


          <AmountRow

            label="Total"

            value={invoice.total}

          />


          <AmountRow

            label="Discount"

            value={invoice.discount}

          />


          <AmountRow

            label="Payable"

            value={invoice.payableAmount}

            bold

          />


        </div>



      </div>


    </div>

  );


}







function InfoRow({

  label,

  value,

}) {


  return (

    <div className="flex gap-2">


      <span className="w-20 text-xs font-semibold text-slate-600">

        {label}

      </span>


      <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">

        {value}

      </div>


    </div>

  );


}







function AmountRow({

  label,

  value,

  bold=false,

}) {


  return (

    <div className="flex justify-between py-1">


      <span className={

        bold
        ?
        "font-semibold"
        :
        "text-slate-500"

      }>

        {label}

      </span>



      <span className={

        bold
        ?
        "font-semibold text-sky-700"
        :
        "text-slate-700"

      }>

        {money(value)}

      </span>



    </div>

  );


}