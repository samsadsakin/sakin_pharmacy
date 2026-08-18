"use client";


import {
  Input,
} from "./InvoiceUtils";


import MedicineSearchInput from "./MedicineSearchInput";



export default function AddMedicine({

  item,

  updateItem,

  addMedicine,

}) {



  // =========================
  // SELECT EXISTING MEDICINE
  // =========================

  function handleMedicineSelect(data) {


    // Medicine ID

    updateItem({

      target: {

        name:
          "medicineId",

        value:
          data.id,

      },

    });



    // Medicine Name

    updateItem({

      target: {

        name:
          "medicine",

        value:
          data.name,

      },

    });



    // Medicine Price

    updateItem({

      target: {

        name:
          "rate",

        value:
          data.price,

      },

    });


  }





  return (

    <section>


      <h3
        className="
        mb-3
        text-sm
        font-semibold
        text-slate-700
        "
      >

        Add Medicine

      </h3>




      <div
        className="
        rounded-xl
        bg-sky-50
        p-4
        "
      >




        {/* =========================
            MEDICINE SEARCH
        ========================= */}

        <MedicineSearchInput


          value={
            item.medicine
          }


          onChange={(value) => {


            // User manually medicine name লিখলে
            // name update হবে

            updateItem({

              target: {

                name:
                  "medicine",

                value:
                  value,

              },

            });



            // Important:
            // manually name change করলে
            // আগের selected medicineId clear হবে

            updateItem({

              target: {

                name:
                  "medicineId",

                value:
                  "",

              },

            });


          }}


          onSelect={
            handleMedicineSelect
          }


        />






        {/* =========================
            QTY / RATE / DISCOUNT
        ========================= */}

        <div
          className="
          mt-3
          grid
          grid-cols-3
          gap-3
          "
        >


          {/* QTY */}

          <Input

            type="number"

            name="qty"

            placeholder="Qty"

            value={
              item.qty
            }

            onChange={
              updateItem
            }

          />




          {/* RATE */}

          <Input

            type="number"

            name="rate"

            placeholder="Rate"

            value={
              item.rate
            }

            onChange={
              updateItem
            }

          />




          {/* DISCOUNT */}

          <Input

            type="number"

            name="dis"

            placeholder="Dis %"

            value={
              item.dis
            }

            onChange={
              updateItem
            }

          />


        </div>






        {/* =========================
            ADD BUTTON
        ========================= */}

        <button

          type="button"

          onClick={
            addMedicine
          }

          className="
          mt-3
          w-full
          rounded-lg
          bg-emerald-700
          py-2.5
          text-sm
          font-semibold
          text-white
          "
        >

          + Add Medicine

        </button>


      </div>


    </section>

  );


}