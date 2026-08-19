import {
  cookies,
} from "next/headers";

import connectDB from "@/lib/mongodb";

import DirectSale from "@/models/directSale";

import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime =
  "nodejs";


// =========================
// GET SESSION USER
// =========================

async function getSessionUser() {

  const cookieStore =
    await cookies();


  const token =
    cookieStore.get(
      "customer_session"
    )?.value;


  if (!token) {
    return null;
  }


  const session =
    await verifySessionToken(
      token
    );


  if (!session?.userId) {
    return null;
  }


  const user =
    await User.findById(
      session.userId
    )
      .select(
        "name mobile role isActive"
      )
      .lean();


  if (
    !user ||
    user.isActive === false
  ) {
    return null;
  }


  return user;
}


// =========================
// GET STAFF
// =========================

export async function GET() {

  try {

    await connectDB();


    const user =
      await getSessionUser();


    if (!user) {

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


    const staff =
      await User.find({
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
          "name mobile role"
        )
        .sort({
          name: 1,
        })
        .lean();


    return Response.json({
      success: true,

      user: {
        name:
          user.name,

        mobile:
          user.mobile,

        role:
          user.role,
      },

      staff,
    });

  }
  catch (error) {

    console.error(
      "Direct Sale GET Error:",
      error
    );


    return Response.json(
      {
        success: false,
        message:
          "Failed to load direct sale data",
      },
      {
        status: 500,
      }
    );

  }

}


// =========================
// ADD DIRECT SALE
// =========================

export async function POST(
  request
) {

  try {

    await connectDB();


    const user =
      await getSessionUser();


    if (!user) {

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


    const date =
      String(
        body.date ||
        ""
      ).trim();


    // =========================
    // VALIDATION
    // =========================

    if (
      !sale ||
      sale <= 0
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Enter valid sale amount",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !customer ||
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


    if (!salesmanNumber) {

      return Response.json(
        {
          success: false,
          message:
            "Select salesman",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date
      )
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid date",
        },
        {
          status: 400,
        }
      );

    }


    // =========================
    // FIND SELECTED STAFF
    // =========================

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
            "Selected staff not found",
        },
        {
          status: 404,
        }
      );

    }


    // =========================
    // CREATE
    // =========================

    const directSale =
      await DirectSale.create({
        sale,

        customer,

        salesman: {
          name:
            salesman.name,

          number:
            salesman.mobile,
        },

        addedBy: {
          name:
            user.name,

          number:
            user.mobile,
        },

        date,
      });


    return Response.json(
      {
        success: true,

        message:
          "Direct sale added successfully",

        directSale,
      },
      {
        status: 201,
      }
    );

  }
  catch (error) {

    console.error(
      "Direct Sale POST Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to add direct sale",
      },
      {
        status: 500,
      }
    );

  }

}