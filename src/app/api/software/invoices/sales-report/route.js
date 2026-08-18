import {
  cookies,
} from "next/headers";

import connectDB from "@/lib/mongodb";

import Invoice from "@/models/invoice";

import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime =
  "nodejs";


// ==============================
// NUMBER
// ==============================

function toNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return 0;

  }


  const number =
    Number(
      String(value)
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "")
    );


  return Number.isFinite(
    number
  )
    ? number
    : 0;

}


// ==============================
// PAYABLE
// ==============================

function getPayable(invoice) {

  const candidates = [

    invoice.payableAmount,

    invoice.payable,

    invoice.totalPayable,

    invoice.netPayable,

    invoice.grandTotal,

    invoice.netTotal,

    invoice.calculation
      ?.payableAmount,

    invoice.calculation
      ?.payable,

    invoice.calculation
      ?.netTotal,

    invoice.calculation
      ?.totalPayable,

    invoice.totals
      ?.payable,

  ];


  for (
    const value of candidates
  ) {

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {

      return toNumber(
        value
      );

    }

  }


  return 0;

}


// ==============================
// DHAKA DATE
// ==============================

function dhakaDateString(
  input = new Date()
) {

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "Asia/Dhaka",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).formatToParts(
      new Date(input)
    );


  const get =
    (type) =>
      parts.find(
        (item) =>
          item.type === type
      )?.value;


  return (
    `${get("year")}-` +
    `${get("month")}-` +
    `${get("day")}`
  );

}


// ==============================
// ADD DAYS
// ==============================

function addDays(
  dateString,
  days
) {

  const date =
    new Date(
      `${dateString}T00:00:00Z`
    );


  date.setUTCDate(
    date.getUTCDate() +
    days
  );


  return date
    .toISOString()
    .slice(
      0,
      10
    );

}


// ==============================
// WEEKDAY
// ==============================

function getDayName(
  dateString
) {

  const date =
    new Date(
      `${dateString}T00:00:00Z`
    );


  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday:
        "long",

      timeZone:
        "UTC",
    }
  ).format(
    date
  );

}


// ==============================
// GET API
// ==============================

export async function GET(
  request
) {

  try {

    await connectDB();


    // ==============================
    // SESSION
    // ==============================

    const cookieStore =
      await cookies();


    const token =
      cookieStore.get(
        "customer_session"
      )?.value;


    if (!token) {

      return Response.json(
        {
          success:
            false,

          message:
            "Not logged in",
        },
        {
          status:
            401,
        }
      );

    }


    const session =
      await verifySessionToken(
        token
      );


    if (
      !session?.userId
    ) {

      return Response.json(
        {
          success:
            false,

          message:
            "Invalid session",
        },
        {
          status:
            401,
        }
      );

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

      return Response.json(
        {
          success:
            false,

          message:
            "User not found",
        },
        {
          status:
            401,
        }
      );

    }


    // ==============================
    // ROLE CHECK
    // ==============================

    const allowedRoles = [

      "salesman",

      "manager",

      "admin",

    ];


    if (
      !allowedRoles.includes(
        user.role
      )
    ) {

      return Response.json(
        {
          success:
            false,

          message:
            "Access denied",
        },
        {
          status:
            403,
        }
      );

    }


    // ==============================
    // URL
    // ==============================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    const requestedMobile =
      String(
        searchParams.get(
          "sellerNumber"
        ) || ""
      ).trim();


    // ==============================
    // STAFF OPTIONS
    // MANAGER / ADMIN ONLY
    // ==============================

    let staffOptions = [];


    if (
      user.role ===
        "manager" ||
      user.role ===
        "admin"
    ) {

      staffOptions =
        await User.find({

          role: {
            $in: [
              "salesman",
              "manager",
              "admin",
            ],
          },

          isActive: {
            $ne:
              false,
          },

        })
          .select(
            "name mobile role"
          )
          .sort({
            name:
              1,
          })
          .lean();

    }


    // ==============================
    // TARGET USER
    // ==============================

    let targetUser;


    // SALESMAN
    // ALWAYS OWN DATA

    if (
      user.role ===
      "salesman"
    ) {

      targetUser =
        user;

    }

    // MANAGER / ADMIN

    else {

      const targetMobile =
        requestedMobile ||
        user.mobile;


      targetUser =
        staffOptions.find(
          (staff) =>
            String(
              staff.mobile
            ) ===
            String(
              targetMobile
            )
        );


      if (!targetUser) {

        return Response.json(
          {
            success:
              false,

            message:
              "Staff not found",
          },
          {
            status:
              404,
          }
        );

      }

    }


    // ==============================
    // ROLLING LAST 7 DAYS
    //
    // TODAY + PREVIOUS 6 DAYS
    // ==============================

    const today =
      dhakaDateString();


    const from =
      addDays(
        today,
        -6
      );


    const to =
      today;


    // ==============================
    // QUERY
    // ONLY SELECTED PERSON
    // ==============================

    const query = {

      "seller.number":
        targetUser.mobile,


      createdAt: {

        $gte:
          new Date(
            `${from}T00:00:00+06:00`
          ),

        $lte:
          new Date(
            `${to}T23:59:59.999+06:00`
          ),

      },

    };


    // ==============================
    // GET INVOICES
    // ==============================

    const invoices =
      await Invoice.find(
        query
      )
        .lean();


    // ==============================
    // CREATE ALL 7 DAYS
    // ==============================

    const dayMap =
      new Map();


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const date =
        addDays(
          from,
          i
        );


      dayMap.set(
        date,
        {

          day:
            getDayName(
              date
            ),

          date,

          totalInvoices:
            0,

          totalPayable:
            0,

        }
      );

    }


    // ==============================
    // CALCULATE
    // ==============================

    let totalPayable =
      0;


    invoices.forEach(
      (invoice) => {

        const payable =
          getPayable(
            invoice
          );


        totalPayable +=
          payable;


        if (
          !invoice.createdAt
        ) {

          return;

        }


        const date =
          dhakaDateString(
            invoice.createdAt
          );


        const day =
          dayMap.get(
            date
          );


        if (!day) {

          return;

        }


        day.totalInvoices +=
          1;


        day.totalPayable +=
          payable;

      }
    );


    // ==============================
    // WEEK CHART
    // ==============================

    const weekChart =
      Array.from(
        dayMap.values()
      );


    // ==============================
    // RESPONSE
    // ==============================

    return Response.json({

      success:
        true,


      viewer: {

        name:
          user.name,

        mobile:
          user.mobile,

        role:
          user.role,

      },


      selectedSeller: {

        name:
          targetUser.name,

        mobile:
          targetUser.mobile,

        role:
          targetUser.role,

      },


      staffOptions:
        user.role ===
          "salesman"

          ? []

          : staffOptions.map(
              (staff) => ({

                name:
                  staff.name,

                mobile:
                  staff.mobile,

                role:
                  staff.role,

              })
            ),


      week: {

        from,

        to,

      },


      summary: {

        totalInvoices:
          invoices.length,

        totalPayable,

      },


      weekChart,

    });

  }
  catch (error) {

    console.error(
      "Sales Report Error:",
      error
    );


    return Response.json(
      {
        success:
          false,

        message:
          error.message ||
          "Failed to load report",
      },
      {
        status:
          500,
      }
    );

  }

}