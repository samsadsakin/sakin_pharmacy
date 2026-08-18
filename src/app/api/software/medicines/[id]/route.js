import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Medicine from "@/models/medicine";

export const runtime = "nodejs";


// =========================
// DELETE MEDICINE
// =========================

export async function DELETE(
  request,
  { params }
) {

  try {

    await connectDB();


    const { id } =
      await params;


    // =========================
    // VALID ID CHECK
    // =========================

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid medicine ID",
        },
        {
          status: 400,
        }
      );

    }


    // =========================
    // DELETE
    // =========================

    const medicine =
      await Medicine.findByIdAndDelete(
        id
      );


    if (!medicine) {

      return Response.json(
        {
          success: false,
          message:
            "Medicine not found",
        },
        {
          status: 404,
        }
      );

    }


    return Response.json({

      success: true,

      message:
        "Medicine deleted successfully",

    });

  }

  catch (error) {

    console.error(
      "Medicine Delete Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to delete medicine",
      },
      {
        status: 500,
      }
    );

  }

}