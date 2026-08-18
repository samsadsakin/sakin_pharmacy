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


// =========================
// NUMBER
// =========================

function toNumber(value) {

  const number =
    Number(
      String(
        value ?? 0
      )
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "")
    );


  return Number.isFinite(number)
    ? number
    : 0;

}


// =========================
// PAYABLE
// =========================

function getPayable(invoice) {

  const values = [

    invoice.payableAmount,

    invoice.payable,

    invoice.totalPayable,

    invoice.netPayable,

    invoice.grandTotal,

    invoice.calculation?.netTotal,

    invoice.calculation?.payable,

  ];


  for (
    const value of values
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


// =========================
// DHAKA DATE
// =========================

function getDhakaDate(
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


// =========================
// ADD DAYS
// =========================

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


// =========================
// DAY NAME
// =========================

function getDayName(
  date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${date}T00:00:00Z`
    )
  );

}


// =========================
// API
// =========================

export async function GET(
  request
) {

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
          "name mobile role isActive"
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
    // PARAMS
    // =========================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    const sellerNumber =
      String(
        searchParams.get(
          "sellerNumber"
        ) || ""
      ).trim();


    const selectedDate =
      String(
        searchParams.get(
          "date"
        ) || ""
      ).trim();


    // =========================
    // STAFF LIST
    // =========================

    let staffOptions = [];


    if (
      user.role === "manager" ||
      user.role === "admin"
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

    }


    // =========================
    // TARGET STAFF
    // =========================

    let targetUser;


    if (
      user.role ===
      "salesman"
    ) {

      targetUser =
        user;

    }
    else {

      const mobile =
        sellerNumber ||
        user.mobile;


      targetUser =
        staffOptions.find(
          (item) =>
            String(
              item.mobile
            ) ===
            String(
              mobile
            )
        );


      if (!targetUser) {

        return Response.json(
          {
            success: false,
            message: "Staff not found",
          },
          {
            status: 404,
          }
        );

      }

    }


    // =========================
    // DATE RANGE
    // =========================

    const today =
      getDhakaDate();


    const from =
      selectedDate
        ? selectedDate
        : addDays(
            today,
            -6
          );


    const to =
      selectedDate
        ? selectedDate
        : today;


    // =========================
    // QUERY
    // =========================

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


    const invoices =
      await Invoice.find(
        query
      )
        .lean();


    // =========================
    // DAILY MAP
    // =========================

    const dayMap =
      new Map();


    let current =
      from;


    while (
      current <= to
    ) {

      dayMap.set(
        current,
        {

          day:
            getDayName(
              current
            ),

          date:
            current,

          totalInvoices:
            0,

          totalPayable:
            0,

        }
      );


      current =
        addDays(
          current,
          1
        );

    }


    // =========================
    // CALCULATE
    // =========================

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
          getDhakaDate(
            invoice.createdAt
          );


        const item =
          dayMap.get(
            date
          );


        if (!item) {
          return;
        }


        item.totalInvoices +=
          1;


        item.totalPayable +=
          payable;

      }
    );


    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      success: true,


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

          : staffOptions,


      filter: {

        date:
          selectedDate,

      },


      range: {

        from,

        to,

      },


      summary: {

        totalInvoices:
          invoices.length,

        totalPayable,

      },


      daily:
        Array.from(
          dayMap.values()
        ),

    });

  }
  catch (error) {

    console.error(
      "Sales Report Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to load report",
      },
      {
        status: 500,
      }
    );

  }

}