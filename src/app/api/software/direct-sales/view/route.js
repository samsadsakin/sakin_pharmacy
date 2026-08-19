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


// =====================================
// SESSION USER
// =====================================

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


  if (
    !session?.userId
  ) {

    return null;

  }


  return User.findById(
    session.userId
  )
    .select(
      "name mobile role isActive"
    )
    .lean();

}


// =====================================
// GET DIRECT SALES
// =====================================

export async function GET(
  request
) {

  try {

    await connectDB();


    // =====================================
    // USER
    // =====================================

    const user =
      await getSessionUser();


    if (
      !user ||
      user.isActive === false
    ) {

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


    if (
      ![
        "salesman",
        "manager",
        "admin",
      ].includes(
        user.role
      )
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Access denied",
        },
        {
          status: 403,
        }
      );

    }


    // =====================================
    // PARAMS
    // =====================================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    const page =
      Math.max(
        Number(
          searchParams.get(
            "page"
          )
        ) || 1,
        1
      );


    const limit =
      Math.min(
        Math.max(
          Number(
            searchParams.get(
              "limit"
            )
          ) || 50,
          1
        ),
        50
      );


    const date =
      String(
        searchParams.get(
          "date"
        ) || ""
      ).trim();


    const requestedSalesman =
      String(
        searchParams.get(
          "salesmanNumber"
        ) || ""
      ).trim();


    const skip =
      (
        page - 1
      ) *
      limit;


    // =====================================
    // FILTER
    // =====================================

    const filter = {};


    // =====================================
    // SALESMAN
    // ALWAYS OWN NUMBER
    // =====================================

    if (
      user.role ===
      "salesman"
    ) {

      filter[
        "salesman.number"
      ] =
        user.mobile;

    }

    // =====================================
    // MANAGER / ADMIN
    // OPTIONAL FILTER
    // =====================================

    else if (
      requestedSalesman
    ) {

      filter[
        "salesman.number"
      ] =
        requestedSalesman;

    }


    // =====================================
    // DATE
    // =====================================

    if (date) {

      filter.date =
        date;

    }


    // =====================================
    // TOTAL
    // =====================================

    const total =
      await DirectSale.countDocuments(
        filter
      );


    // =====================================
    // SALES
    // =====================================

    const sales =
      await DirectSale.find(
        filter
      )
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();


    const totalPages =
      Math.max(
        Math.ceil(
          total /
          limit
        ),
        1
      );


    return Response.json({

      success: true,

      sales,

      pagination: {

        page,

        limit,

        total,

        totalPages,

      },

    });

  }
  catch (error) {

    console.error(
      "Direct Sale View Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to load direct sales",
      },
      {
        status: 500,
      }
    );

  }

}