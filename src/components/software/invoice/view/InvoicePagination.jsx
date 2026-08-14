"use client";


export default function InvoicePagination({

  currentPage,

  totalPages,

  totalInvoices,

  showingFrom,

  showingTo,

  setCurrentPage,

}) {


  if(totalInvoices <= 0){

    return null;

  }



  return (


    <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">



      {/* INFO */}


      <p className="text-xs text-slate-500">


        Showing{" "}


        <span className="font-semibold text-slate-700">

          {showingFrom}

        </span>


        {" - "}


        <span className="font-semibold text-slate-700">

          {showingTo}

        </span>


        {" of "}


        <span className="font-semibold text-slate-700">

          {totalInvoices}

        </span>


        {" invoices"}


      </p>






      {/* BUTTONS */}


      <div className="join">



        <button

          type="button"

          onClick={() => {


            setCurrentPage(

              (page)=>

                Math.max(
                  1,
                  page - 1
                )

            );


          }}

          disabled={
            currentPage === 1
          }

          className="join-item btn btn-sm"

        >

          Previous

        </button>








        <button

          type="button"

          className="join-item btn btn-sm pointer-events-none"

        >

          Page {currentPage} of {totalPages}

        </button>








        <button

          type="button"

          onClick={() => {


            setCurrentPage(

              (page)=>

                Math.min(
                  totalPages,
                  page + 1
                )

            );


          }}

          disabled={
            currentPage >= totalPages
          }

          className="join-item btn btn-sm"

        >

          Next

        </button>




      </div>



    </div>


  );


}