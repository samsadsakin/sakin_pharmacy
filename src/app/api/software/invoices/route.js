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
// POST
// =========================

export async function POST(request) {

  try {

    await connectDB();



    // =========================
    // LOGIN SESSION
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
    // CUSTOMER AUTO ADD / UPDATE
    // =========================

    if (
      customerName &&
      customerMobile
    ) {

      const existingCustomer =
        await User.findOne({
          mobile: customerMobile,
        });



      // =========================
      // EXISTING USER
      // =========================

      if (existingCustomer) {


        // শুধু customer role হলে
        // invoice থেকে name update হবে

        if (
          existingCustomer.role ===
          "customer"
        ) {

          if (
            existingCustomer.name !==
            customerName
          ) {

            existingCustomer.name =
              customerName;

            await existingCustomer.save();

          }

        }


        // salesman / manager / admin
        // হলে কোনো account change হবে না

      }


      // =========================
      // NEW CUSTOMER
      // =========================

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
    // CHECK MEDICINE PRICE UPDATE
    // =========================

    if (
      Array.isArray(
        data.medicines
      )
    ) {

      for (
        const medicine of data.medicines
      ) {


        if (
          !medicine.medicineId
        ) {

          continue;

        }



        const existingMedicine =
          await Medicine.findById(
            medicine.medicineId
          )
            .lean();


        if (
          !existingMedicine
        ) {

          continue;

        }



        const oldPrice =
          Number(
            existingMedicine.salePrice || 0
          );


        const newPrice =
          Number(
            medicine.rate || 0
          );



        // =========================
        // SAME PRICE
        // =========================

        if (
          oldPrice === newPrice
        ) {

          continue;

        }



        // =========================
        // DUPLICATE PENDING CHECK
        // =========================

        const alreadyPending =
          await MedicineUpdate.findOne({

            medicineId:
              existingMedicine._id,

            oldPrice,

            newPrice,

            status:
              "pending",

          });


        if (
          alreadyPending
        ) {

          continue;

        }



        // =========================
        // CREATE PRICE UPDATE
        // =========================

        await MedicineUpdate.create({

          type:
            "price_update",

          medicineId:
            existingMedicine._id,

          medicineName:
            existingMedicine.name,

          oldPrice,

          newPrice,

          status:
            "pending",

          createdBy: {

            name:
              user.name,

            mobile:
              user.mobile,

          },

        });

      }

    }




    // =========================
    // FINAL INVOICE DATA
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