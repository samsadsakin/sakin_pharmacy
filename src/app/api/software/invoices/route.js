import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";

import Invoice from "@/models/invoice";
import User from "@/models/user";
import Medicine from "@/models/medicine";
import MedicineUpdate from "@/models/medicineUpdate";

import {
  verifySessionToken,
} from "@/lib/auth";

import {
  sendSMS,
} from "@/lib/(sms)/sendSMS";

import {
  createInvoiceSMS,
} from "@/lib/(sms)/smsMessage";


export const runtime = "nodejs";



// =========================
// NORMALIZE MEDICINE NAME
// =========================

function normalizeMedicineName(text) {

  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

}



// =========================
// FORMAT DISPLAY NAME
// =========================

function formatMedicineName(text) {

  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(
      /\b[a-z]/g,
      (char) => char.toUpperCase()
    );

}



// =========================
// ESCAPE REGEX
// =========================

function escapeRegex(text) {

  return String(text).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

}



// =========================
// POST
// =========================

export async function POST(request) {

  try {

    await connectDB();



    // =========================
    // SESSION
    // =========================

    const cookieStore =
      await cookies();


    const token =
      cookieStore.get(
        "customer_session"
      )?.value;


    if (!token) {

      return Response.json(
        {
          success: false,
          message: "Not logged in",
        },
        {
          status: 401,
        }
      );

    }



    const session =
      await verifySessionToken(
        token
      );


    if (!session?.userId) {

      return Response.json(
        {
          success: false,
          message: "Invalid session",
        },
        {
          status: 401,
        }
      );

    }



    const user =
      await User.findById(
        session.userId
      )
        .select(
          "name mobile role"
        )
        .lean();


    if (!user) {

      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );

    }



    // =========================
    // FRONTEND DATA
    // =========================

    const data =
      await request.json();



    // =========================
    // CUSTOMER DATA
    // =========================

    const customerName =
      String(
        data.customer?.name || ""
      ).trim();


    const customerMobile =
      String(
        data.customer?.phone || ""
      )
        .replace(/\D/g, "")
        .trim();



    // =========================
    // CUSTOMER ADD / UPDATE
    // =========================

    if (
      customerName &&
      customerMobile
    ) {

      const existingCustomer =
        await User.findOne({
          mobile: customerMobile,
        });


      if (existingCustomer) {

        if (
          existingCustomer.role ===
          "customer" &&
          existingCustomer.name !==
          customerName
        ) {

          existingCustomer.name =
            customerName;

          await existingCustomer.save();

        }

      }

      else {

        await User.create({

          name:
            customerName,

          mobile:
            customerMobile,

          role:
            "customer",

          isActive:
            true,

        });

      }

    }



    // =========================
    // INVOICE DATA
    // =========================

    const invoiceData = {

      invoiceNo:
        String(
          data.invoiceNo || ""
        ),


      date:
        data.date
          ? new Date(data.date)
          : new Date(),


      seller: {

        name:
          String(
            user.name || ""
          ),

        number:
          String(
            user.mobile || ""
          ),

      },


      invoiceType:
        data.invoiceType === "kemo"
          ? "kemo"
          : "regular",


      customer: {

        name:
          customerName,

        moreInfo:
          data.customer?.moreInfo || "",

        phone:
          customerMobile,

      },


      medicines:
        Array.isArray(
          data.medicines
        )
          ? data.medicines
          : [],


      total:
        Number(
          data.total || 0
        ),


      discount:
        Number(
          data.discount || 0
        ),


      payableAmount:
        Number(
          data.payableAmount || 0
        ),


      options: {

        sms:
          Boolean(
            data.options?.sms
          ),

        smsType:
          data.options?.smsType ||
          "short",

        print:
          Boolean(
            data.options?.print
          ),

        paid:
          Boolean(
            data.options?.paid
          ),

      },

    };



    // =========================
    // SAVE INVOICE
    // =========================

    const invoice =
      await Invoice.create(
        invoiceData
      );



    // =========================================
    // MEDICINE CHECK
    // ONLY MAIN MEDICINE COLLECTION
    // =========================================

    try {

      if (
        Array.isArray(
          data.medicines
        )
      ) {

        for (
          const medicine of data.medicines
        ) {

          const medicineName =
            String(
              medicine.medicine || ""
            )
              .trim()
              .replace(/\s+/g, " ");


          const newPrice =
            Number(
              medicine.rate
            );


          if (!medicineName) {

            continue;

          }


          if (
            !Number.isFinite(newPrice) ||
            newPrice < 0
          ) {

            continue;

          }



          const searchName =
            normalizeMedicineName(
              medicineName
            );



          // =================================
          // STEP 1:
          // medicineId থাকলে ID দিয়ে
          // main Medicine collection check
          // =================================

          let existingMedicine =
            null;


          if (
            medicine.medicineId
          ) {

            try {

              const medicineById =
                await Medicine.findById(
                  medicine.medicineId
                )
                  .lean();


              // Stale ID যেন ভুল medicine
              // হিসেবে ধরা না হয়

              if (
                medicineById &&
                normalizeMedicineName(
                  medicineById.name
                ) === searchName
              ) {

                existingMedicine =
                  medicineById;

              }

            }

            catch (idError) {

              console.log(
                "Medicine ID lookup skipped:",
                medicine.medicineId
              );

            }

          }



          // =================================
          // STEP 2:
          // ID দিয়ে না পাওয়া গেলে
          // exact searchName check
          // =================================

          if (!existingMedicine) {

            existingMedicine =
              await Medicine.findOne({

                searchName:
                  searchName,

                isActive:
                  true,

              })
                .lean();

          }



          console.log(
            "MEDICINE CHECK:",
            {
              invoiceName:
                medicineName,

              medicineId:
                medicine.medicineId || null,

              invoicePrice:
                newPrice,

              found:
                Boolean(
                  existingMedicine
                ),

              mainName:
                existingMedicine?.name,

              mainPrice:
                existingMedicine?.salePrice,
            }
          );



          // =================================
          // MEDICINE EXISTS
          // =================================

          if (existingMedicine) {

            const oldPrice =
              Number(
                existingMedicine.salePrice || 0
              );



            // =========================
            // SAME NAME + SAME PRICE
            // NOTHING
            // =========================

            if (
              oldPrice === newPrice
            ) {

              console.log(
                "SAME MEDICINE + SAME PRICE:",
                existingMedicine.name
              );

              continue;

            }



            // =========================
            // SAME NAME +
            // DIFFERENT PRICE
            //
            // PRICE UPDATE REQUEST
            // =========================

            console.log(
              "PRICE UPDATE DETECTED:",
              existingMedicine.name,
              oldPrice,
              "=>",
              newPrice
            );



            const existingPending =
              await MedicineUpdate.findOne({

                medicineId:
                  existingMedicine._id,

                type:
                  "price_update",

                newPrice:
                  newPrice,

                status:
                  "pending",

                "createdBy.mobile":
                  user.mobile,

              })
                .lean();



            if (existingPending) {

              console.log(
                "PRICE UPDATE ALREADY PENDING:",
                existingMedicine.name
              );

              continue;

            }



            await MedicineUpdate.create({

              medicineId:
                existingMedicine._id,

              medicineName:
                existingMedicine.name,

              type:
                "price_update",

              oldPrice:
                oldPrice,

              newPrice:
                newPrice,

              createdBy: {

                name:
                  user.name || "",

                mobile:
                  user.mobile || "",

              },

              status:
                "pending",

            });



            console.log(
              "PRICE UPDATE REQUEST CREATED:",
              existingMedicine.name,
              oldPrice,
              "=>",
              newPrice
            );


            continue;

          }



          // =================================
          // MAIN MEDICINE COLLECTION-এ
          // MEDICINE নেই
          //
          // NEW MEDICINE REQUEST
          // =================================

          const displayName =
            formatMedicineName(
              medicineName
            );


          const nameRegex =
            new RegExp(

              `^${escapeRegex(
                displayName
              )}$`,

              "i"

            );



          const existingNewPending =
            await MedicineUpdate.findOne({

              medicineName:
                nameRegex,

              type:
                "new_medicine",

              status:
                "pending",

              "createdBy.mobile":
                user.mobile,

            })
              .lean();



          if (existingNewPending) {

            console.log(
              "NEW MEDICINE ALREADY PENDING:",
              displayName
            );

            continue;

          }



          await MedicineUpdate.create({

            medicineId:
              null,

            medicineName:
              displayName,

            type:
              "new_medicine",

            oldPrice:
              null,

            newPrice:
              newPrice,

            createdBy: {

              name:
                user.name || "",

              mobile:
                user.mobile || "",

            },

            status:
              "pending",

          });



          console.log(
            "NEW MEDICINE REQUEST CREATED:",
            displayName
          );

        }

      }

    }

    catch (medicineError) {

      console.error(
        "INVOICE MEDICINE CHECK ERROR:",
        medicineError
      );

    }



    // =========================
    // SMS
    // =========================

    if (
      data.options?.sms &&
      customerMobile
    ) {

      try {

        const smsData = {

          ...data,

          customer: {

            ...data.customer,

            name:
              customerName,

            phone:
              customerMobile,

          },

        };


        const message =
          createInvoiceSMS(
            smsData
          );


        await sendSMS(
          customerMobile,
          message
        );

      }

      catch (smsError) {

        console.error(
          "Invoice SMS Error:",
          smsError
        );

      }

    }



    // =========================
    // SUCCESS
    // =========================

    return Response.json(
      {
        success: true,

        message:
          "Invoice saved successfully",

        invoice,
      },
      {
        status: 201,
      }
    );

  }

  catch (error) {

    console.error(
      "Invoice POST Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to save invoice",
      },
      {
        status: 500,
      }
    );

  }

}



// =========================
// GET
// =========================

export async function GET() {

  try {

    await connectDB();


    const invoices =
      await Invoice.find()
        .sort({
          createdAt: -1,
        })
        .lean();


    return Response.json({
      success: true,
      invoices,
    });

  }

  catch (error) {

    console.error(
      "Invoice GET Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to load invoices",
      },
      {
        status: 500,
      }
    );

  }

}