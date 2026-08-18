import connectDB from "@/lib/mongodb";

import Medicine from "@/models/medicine";
import MedicineUpdate from "@/models/medicineUpdate";
import User from "@/models/user";

import { cookies } from "next/headers";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";




// =========================
// NORMALIZE SEARCH NAME
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


    // =========================
    // REQUEST BODY
    // =========================

    const body =
      await request.json();


    const medicineName =
      String(
        body.medicineName || ""
      )
        .trim()
        .replace(/\s+/g, " ");


    const newPrice =
      Number(
        body.newPrice
      );




    // =========================
    // VALIDATION
    // =========================

    if (!medicineName) {

      return Response.json(
        {
          success: false,
          message:
            "Medicine name is required",
        },
        {
          status: 400,
        }
      );

    }



    if (
      !Number.isFinite(newPrice) ||
      newPrice < 0
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Valid medicine price is required",
        },
        {
          status: 400,
        }
      );

    }




    // =========================
    // SESSION USER
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
          message:
            "Not logged in",
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
          message:
            "Invalid session",
        },
        {
          status: 401,
        }
      );

    }




    // =========================
    // CONNECT DATABASE
    // =========================

    await connectDB();




    // =========================
    // GET LOGGED USER
    // =========================

    const user =
      await User.findById(
        session.userId
      )
        .select(
          "name mobile"
        )
        .lean();



    if (!user) {

      return Response.json(
        {
          success: false,
          message:
            "User not found",
        },
        {
          status: 401,
        }
      );

    }




    // =========================
    // SEARCH MASTER MEDICINE
    // =========================

    const searchName =
      normalizeMedicineName(
        medicineName
      );


    const existingMedicine =
      await Medicine.findOne({

        searchName:
          searchName,

        isActive:
          true,

      })
        .lean();





    // ====================================
    // EXISTING MEDICINE FOUND
    // ====================================

    if (existingMedicine) {


      const oldPrice =
        Number(
          existingMedicine.salePrice || 0
        );




      // =========================
      // SAME NAME + SAME PRICE
      // NO UPDATE
      // =========================

      if (
        oldPrice === newPrice
      ) {

        return Response.json({

          success: true,

          noChange: true,

          type:
            "no_change",

          message:
            "Medicine name and price are already same. No update required.",

        });

      }




      // =========================
      // SAME NAME
      // DIFFERENT PRICE
      // CHECK DUPLICATE
      // =========================

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

        return Response.json({

          success: true,

          duplicate: true,

          type:
            "price_update",

          message:
            "This price update is already pending.",

          update:
            existingPending,

        });

      }




      // =========================
      // CREATE PRICE UPDATE
      // =========================

      const update =
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




      return Response.json(
        {

          success: true,

          type:
            "price_update",

          message:
            "Price update added to pending.",

          update,

        },
        {
          status: 201,
        }
      );

    }





    // ====================================
    // MEDICINE NOT FOUND
    // NEW MEDICINE
    // ====================================

    const displayName =
      formatMedicineName(
        medicineName
      );




    // =========================
    // DUPLICATE NEW PENDING CHECK
    // =========================

    const nameRegex =
      new RegExp(
        `^${escapeRegex(displayName)}$`,
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

      return Response.json({

        success: true,

        duplicate: true,

        type:
          "new_medicine",

        message:
          "This new medicine is already pending.",

        update:
          existingNewPending,

      });

    }




    // =========================
    // CREATE NEW MEDICINE PENDING
    // =========================

    const update =
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




    return Response.json(
      {

        success: true,

        type:
          "new_medicine",

        message:
          "New medicine added to pending.",

        update,

      },
      {
        status: 201,
      }
    );


  }

  catch (error) {


    console.error(
      "Medicine Update Add Error:",
      error
    );


    return Response.json(
      {

        success: false,

        message:
          error?.message ||
          "Server error",

      },
      {
        status: 500,
      }
    );


  }

}