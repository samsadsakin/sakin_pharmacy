// src/components/software/invoice/CreateInvoice.jsx


"use client";


import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useRouter,
} from "next/navigation";


import Swal from "sweetalert2";


import {

  emptyCustomer,

  emptyMedicine,

  defaultOptions,

  getAmount,

} from "./(allInvoice)/InvoiceUtils";



import InvoiceHeader from "./(allInvoice)/InvoiceHeader";

import CustomerSection from "./(allInvoice)/CustomerSection";

import MedicineTable from "./(allInvoice)/MedicineTable";

import AddMedicine from "./(allInvoice)/AddMedicine";

import CalculationBox from "./(allInvoice)/CalculationBox";

import InvoiceOptions from "./(allInvoice)/InvoiceOptions";

import SaveInvoiceButton from "./(allInvoice)/SaveInvoiceButton";





let nextId = 1;





export default function CreateInvoice() {


  const router =
    useRouter();
  const invoiceLoaded = useRef(false);




  // ================= INVOICE INFO =================


  const [invoiceNo, setInvoiceNo] =
    useState("");



  const [invoiceDate, setInvoiceDate] =
    useState("");



  const [seller, setSeller] =
    useState({

      name: "",

      number: "",

    });



  const [invoiceType, setInvoiceType] =
    useState("regular");







  // ================= CUSTOMER =================


  const [customer, setCustomer] =
    useState({

      ...emptyCustomer

    });







  // ================= MEDICINE =================


  const [item, setItem] =
    useState({

      ...emptyMedicine

    });


  const [rows, setRows] =
    useState([]);







  // ================= PAYABLE =================


  const [payable, setPayable] =
    useState("");







  // ================= OPTIONS =================


  const [options, setOptions] =
    useState({

      ...defaultOptions

    });







  // ================= LOAD DATE =================


  useEffect(() => {


    if (invoiceLoaded.current) {

      return;

    }


    invoiceLoaded.current = true;



    const today =

      new Date()

        .toISOString()

        .split("T")[0];



    setInvoiceDate(today);



    loadInvoiceNumber();


    loadSeller();



  }, []);




  //-------------number load-------------

  const loadInvoiceNumber = async () => {


    try {


      const res =

        await fetch(

          "/api/software/invoices/next",

          {

            cache: "no-store"

          }

        );



      const data =

        await res.json();



      if (data.success) {


        setInvoiceNo(
          data.invoiceNo
        );


      }



    }

    catch (error) {


      console.log(
        "Invoice Number Error",
        error
      );


    }



  };

  // ================= SELLER LOAD =================



  const loadSeller = async () => {


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


        setSeller({

          name:
            data.user.name,


          number:
            data.user.mobile,


        });


      }



    }

    catch (error) {


      console.log(
        "Seller Load Error",
        error
      );


    }


  };







  // ================= CALCULATION =================


  const total =

    rows.reduce(

      (sum, row) =>

        sum + getAmount(row),

      0

    );






  const payableAmount =

    payable === ""

      ?

      total

      :

      Number(payable || 0);






  const discount =

    Math.max(

      total - payableAmount,

      0

    );






  // ================= UPDATE MEDICINE =================


  const updateItem = (e) => {


    setItem({

      ...item,

      [e.target.name]:

        e.target.value,


    });


  };






  // ================= ADD MEDICINE =================


  const addMedicine = () => {


    if (

      !item.medicine ||

      !item.qty ||

      !item.rate

    ) {

      return;

    }



    setRows([

      ...rows,

      {

        id: nextId++,

        ...item

      }

    ]);



    setItem({

      ...emptyMedicine

    });


  };


  // ================= DELETE MEDICINE =================


  const deleteMedicine = (id) => {


    setRows(

      rows.filter(

        (row) =>

          row.id !== id

      )

    );


  };
  // ================= RESET =================


  const resetInvoice = () => {


    setCustomer({

      ...emptyCustomer

    });


    setItem({

      ...emptyMedicine

    });


    setRows([]);


    setPayable("");



    setOptions({

      ...defaultOptions

    });


    nextId = 1;


  };








  // ================= SAVE INVOICE =================


  const saveInvoice = async () => {


    const shouldPrint =
      options.print;





    const data = {


      invoiceNo,


      date:
        invoiceDate,



      seller,



      invoiceType,



      customer,





      medicines:


        rows.map(

          (row, index) => ({


            sl: index + 1,


            medicine:
              row.medicine,


            qty:
              Number(row.qty),


            rate:
              Number(row.rate),


            percentageDiscount:
              Number(row.dis || 0),


            amount:
              getAmount(row),


          })

        ),






      total,


      discount,


      payableAmount,





      options: {


        sms:
          options.sms,



        ...(options.sms && {

          smsType:
            options.smsType,

        }),



        print:
          options.print,


        paid:
          options.paid,


      },



    };






    console.log(
      "Invoice Data:",
      data
    );








    try {


      const res =

        await fetch(

          "/api/software/invoices",

          {

            method: "POST",


            headers: {

              "Content-Type":
                "application/json",

            },


            body:
              JSON.stringify(data),

          }

        );







      const result =

        await res.json();






      if (!res.ok) {


        await Swal.fire({

          title: "Failed",

          text:

            result.message ||

            "Failed to save invoice",

          icon: "error",

        });


        return;


      }







      const invoiceId =

        result.invoice?._id;







      if (!invoiceId) {



        await Swal.fire({

          title: "Error",

          text:

            "Invoice ID not found",

          icon: "error",

        });


        return;


      }






      resetInvoice();







      if (shouldPrint) {


        await Swal.fire({

          title: "Saved!",

          text:

            "Invoice saved successfully",

          icon: "success",

          timer: 700,

          showConfirmButton: false,

        });





        router.push(

          `/software/Invoice/PrintInvoice/${invoiceId}`

        );



        return;


      }








      await Swal.fire({

        title: "Saved!",

        text:

          "Invoice saved successfully",

        icon: "success",

        timer: 1200,

        showConfirmButton: false,

      });





    }

    catch (error) {


      console.error(

        "Save Invoice Error:",

        error

      );




      await Swal.fire({

        title: "Error",

        text:

          "Failed to save invoice",

        icon: "error",

      });


    }



  };









  // ================= UI =================


  return (

    <main className="min-h-screen bg-slate-50 p-4 text-slate-700">


      <div className="mx-auto max-w-6xl rounded-xl bg-white p-5 shadow-sm">



        <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">

          Create Invoice

        </h1>






        <InvoiceHeader

          invoiceNo={invoiceNo}

          date={invoiceDate}

          seller={seller}

          invoiceType={invoiceType}

          setInvoiceType={setInvoiceType}

        />







        <CustomerSection

          customer={customer}

          setCustomer={setCustomer}

        />







        <MedicineTable

          rows={rows}

          deleteMedicine={deleteMedicine}

        />







        <div className="grid gap-6 lg:grid-cols-2">



          <AddMedicine

            item={item}

            updateItem={updateItem}

            addMedicine={addMedicine}

          />







          <CalculationBox

            total={total}

            discount={discount}

            payable={payable}

            setPayable={setPayable}

          />





        </div>







        <InvoiceOptions

          options={options}

          setOptions={setOptions}

        />







        <SaveInvoiceButton

          onClick={saveInvoice}

          disabled={!rows.length}

        />







      </div>


    </main>

  );


}