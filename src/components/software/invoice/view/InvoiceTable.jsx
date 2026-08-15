"use client";


import {
  ActionButtons,
  Th,
  Td,
  money,
  formatDate,

} from "@/components/software/invoice/ViewInvoiceComponents";





export default function InvoiceTable({

  invoices = [],

  onView,

  onDelete,

}) {


  return (

    <div className="overflow-hidden rounded-xl ring-1 ring-slate-100">


      <div className="overflow-x-auto">


        <table className="w-full table-fixed text-sm">


          <thead className="bg-sky-50 text-slate-700">


            <tr>


              <Th className="hidden md:table-cell">
                Invoice Date
              </Th>


              <Th>
                Inv No
              </Th>


              <Th>
                Seller
              </Th>


              <Th>
                Paid Amt
              </Th>


              <Th className="hidden md:table-cell">
                Medicine
              </Th>


              <Th>
                Action
              </Th>


            </tr>


          </thead>





          <tbody>


            {
              invoices.length === 0 ? (


                <tr>


                  <td
                    colSpan="6"
                    className="py-14 text-center text-slate-400"
                  >

                    No invoice found


                  </td>


                </tr>


              ) : (


                invoices.map((invoice) => (


                  <tr

                    key={invoice._id}

                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"

                  >



                    {/* DATE */}

                    <Td className="hidden md:table-cell">

                      {formatDate(invoice.date)}

                    </Td>





                    {/* INVOICE NO */}

                    <Td className="font-semibold text-sky-700">

                      {invoice.invoiceNo}

                    </Td>






                    {/* SELLER */}

                    <Td className="font-medium text-emerald-700">

                      {invoice.seller?.name || "N/A"}

                    </Td>






                    {/* PAYABLE */}

                    <Td>

                      {money(invoice.payableAmount)}

                    </Td>







                    {/* MEDICINE */}

                    <Td className="hidden md:table-cell">

                      {invoice.medicines?.length || 0}

                    </Td>







                    {/* ACTION */}

                    <Td>


                      <ActionButtons

                        invoice={invoice}

                        onView={onView}                      

                        onDelete={onDelete}

                      />


                    </Td>





                  </tr>


                ))


              )


            }


          </tbody>


        </table>


      </div>


    </div>


  );


}