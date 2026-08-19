import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

import DirectSale from "@/models/directSale";

import User from "@/models/user";


export const runtime =
  "nodejs";


// =====================================
// UPDATE
// =====================================

export async function PATCH(
  request,
  { params }
) {

  try {

    await connectDB();


    const {
      id,
    } =
      await params;


    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {

      return Response.json(
        {
          success: false,

          message:
            "Invalid sale ID",
        },
        {
          status: 400,
        }
      );

    }


    const body =
      await request.json();


    const sale =
      Number(
        body.sale
      );


    const customer =
      Number(
        body.customer
      );


    const salesmanNumber =
      String(
        body.salesmanNumber ||
        ""
      ).trim();


    if (
      sale <= 0
    ) {

      return Response.json(
        {
          success: false,

          message:
            "Invalid sale amount",
        },
        {
          status: 400,
        }
      );

    }


    if (
      customer < 1
    ) {

      return Response.json(
        {
          success: false,

          message:
            "Customer must be at least 1",
        },
        {
          status: 400,
        }
      );

    }


    const salesman =
      await User.findOne({

        mobile:
          salesmanNumber,

        role: {
          $in: [
            "salesman",
            "manager",
            "admin",
          ],
        },

        isActive: {
          $ne: false,
        },

      })
        .select(
          "name mobile"
        )
        .lean();


    if (!salesman) {

      return Response.json(
        {
          success: false,

          message:
            "Salesman not found",
        },
        {
          status: 404,
        }
      );

    }


    const updated =
      await DirectSale.findByIdAndUpdate(
        id,
        {
          $set: {

            sale,

            customer,

            salesman: {

              name:
                salesman.name,

              number:
                salesman.mobile,

            },

          },
        },
        {
          new: true,
          runValidators: true,
        }
      );


    if (!updated) {

      return Response.json(
        {
          success: false,

          message:
            "Direct sale not found",
        },
        {
          status: 404,
        }
      );

    }


    return Response.json({

      success: true,

      message:
        "Direct sale updated successfully",

      directSale:
        updated,

    });

  }
  catch (error) {

    console.error(
      "Direct Sale Update Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to update direct sale",
      },
      {
        status: 500,
      }
    );

  }

}


// =====================================
// DELETE
// =====================================

export async function DELETE(
  request,
  { params }
) {

  try {

    await connectDB();


    const {
      id,
    } =
      await params;


    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {

      return Response.json(
        {
          success: false,

          message:
            "Invalid sale ID",
        },
        {
          status: 400,
        }
      );

    }


    const deleted =
      await DirectSale.findByIdAndDelete(
        id
      );


    if (!deleted) {

      return Response.json(
        {
          success: false,

          message:
            "Direct sale not found",
        },
        {
          status: 404,
        }
      );

    }


    return Response.json({

      success: true,

      message:
        "Direct sale deleted successfully",

    });

  }
  catch (error) {

    console.error(
      "Direct Sale Delete Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          "Failed to delete direct sale",
      },
      {
        status: 500,
      }
    );

  }

}