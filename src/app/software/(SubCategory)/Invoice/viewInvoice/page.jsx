"use client";

import {
  useEffect,
  useState,
} from "react";


import Swal from "sweetalert2";


import {

  InvoiceFilter,

  InvoiceTable,

  InvoicePagination,

  InvoiceModal,

} from "@/components/software/invoice/view";





const INVOICES_PER_PAGE = 50;






function getTodayDate() {


  const date =
    new Date();


  return (

    date.getFullYear()
    +
    "-"
    +
    String(
      date.getMonth() + 1
    ).padStart(2, "0")
    +
    "-"
    +
    String(
      date.getDate()
    ).padStart(2, "0")

  );


}








export default function ViewInvoicePage() {





  const [invoices, setInvoices]
    =
    useState([]);




  const [selected, setSelected]
    =
    useState(null);




  const [loading, setLoading]
    =
    useState(true);




  const [error, setError]
    =
    useState("");





  const [fromDate, setFromDate]
    =
    useState("");



  const [toDate, setToDate]
    =
    useState("");



  const [invoiceSearch, setInvoiceSearch]
    =
    useState("");






  const [currentPage, setCurrentPage]
    =
    useState(1);



  const [totalPages, setTotalPages]
    =
    useState(1);



  const [totalInvoices, setTotalInvoices]
    =
    useState(0);





  // =========================
  // USER
  // =========================


  const [user, setUser]
    =
    useState(null);






  // =========================
  // GET USER
  // =========================


  const getUser =
    async () => {


      try {


        const res =
          await fetch(

            "/api/auth/me",

            {
              cache: "no-store"
            }

          );



        const data =
          await res.json();



        if (data.success) {

          setUser(
            data.user
          );

        }



      }

      catch (error) {


        console.log(
          "User Load Error",
          error
        );


      }


    };









  useEffect(() => {


    getUser();


  }, []);










  // =========================
  // GET INVOICES
  // =========================


  const getInvoices =
    async () => {


      try {


        setLoading(true);




        const params =
          new URLSearchParams();





        params.set(
          "page",
          currentPage
        );





        params.set(
          "limit",
          INVOICES_PER_PAGE
        );






        // SALESMAN FILTER

        if (
          user?.role === "salesman"
        ) {

          params.set(
            "sellerNumber",
            user.mobile
          );

        }







        if (invoiceSearch) {


          params.set(
            "invoiceNo",
            invoiceSearch
          );


        }
        else {


          if (fromDate)

            params.set(
              "from",
              fromDate
            );



          if (toDate)

            params.set(
              "to",
              toDate
            );



        }






        const res =
          await fetch(

            `/api/software/invoices/view?${params}`,

            {
              cache: "no-store"
            }

          );






        const data =
          await res.json();






        if (!res.ok) {

          throw new Error(
            data.message
          );

        }






        setInvoices(

          data.invoices || []

        );






        setTotalInvoices(

          data.pagination?.total || 0

        );






        setTotalPages(

          data.pagination?.totalPages || 1

        );




      }


      catch (err) {


        console.error(err);


        setError(
          "Failed to load invoices"
        );



      }


      finally {


        setLoading(false);


      }


    };







  useEffect(() => {


    if (user !== null) {


      getInvoices();


    }


  }, [

    currentPage,

    fromDate,

    toDate,

    invoiceSearch,

    user


  ]);
  // =========================
  // DELETE
  // =========================


  const handleDelete =
    async (invoice) => {


      const result =
        await Swal.fire({

          title:
            "Delete Invoice?",

          icon:
            "warning",

          showCancelButton: true,

          confirmButtonText:
            "Delete"

        });



      if (!result.isConfirmed)
        return;





      await fetch(

        `/api/software/invoices/${invoice._id}`,

        {

          method: "DELETE"

        }

      );





      getInvoices();



    };









  // =========================
  // VIEW
  // =========================


  const handleView = (invoice) => {


    setSelected(invoice);


  };









  const today =
    getTodayDate();






  const isTodayActive =

    fromDate === today &&
    toDate === today;








  const showingFrom =

    totalInvoices

      ?

      (
        currentPage - 1
      )
      *
      INVOICES_PER_PAGE
      +
      1

      :

      0;






  const showingTo =

    Math.min(

      currentPage *
      INVOICES_PER_PAGE,

      totalInvoices

    );









  return (


    <div className="rounded-xl bg-white p-4 shadow-sm">



      <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">

        View Invoice

      </h1>









      <InvoiceFilter


        today={today}


        isTodayActive={isTodayActive}



        fromDate={fromDate}


        toDate={toDate}


        invoiceSearch={invoiceSearch}





        setFromDate={setFromDate}


        setToDate={setToDate}


        setInvoiceSearch={setInvoiceSearch}






        onToday={() => {


          setFromDate(today);

          setToDate(today);

          setInvoiceSearch("");

          setCurrentPage(1);


        }}






        onClear={() => {


          setFromDate("");

          setToDate("");

          setInvoiceSearch("");

          setCurrentPage(1);


        }}


      />









      {
        loading ?

          <p className="py-10 text-center">

            Loading...

          </p>


          :


          <InvoiceTable



            invoices={invoices}



            onView={handleView}



            onDelete={handleDelete}



          />

      }









      <InvoicePagination



        currentPage={currentPage}



        totalPages={totalPages}



        totalInvoices={totalInvoices}



        showingFrom={showingFrom}



        showingTo={showingTo}



        setCurrentPage={setCurrentPage}


      />









      {
        selected &&


        <InvoiceModal


          invoice={selected}



          onClose={() => setSelected(null)}


        />

      }




    </div>


  );


}