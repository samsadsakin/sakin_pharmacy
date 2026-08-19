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
// DATE + DAYS
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
// DHAKA TODAY
// =========================

function getDhakaDate() {

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
      new Date()
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
// DAY NAME
// =========================

function getDayName(
  dateString
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday:
        "long",

      timeZone:
        "UTC",
    }
  ).format(
    new Date(
      `${dateString}T00:00:00Z`
    )
  );

}


// =========================
// SESSION USER
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


// =========================
// REPORT
// =========================

export async function GET(
  request
) {

  try {

    await connectDB();


    // =========================
    // LOGGED USER
    // =========================

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


    // =========================
    // PARAMS
    // =========================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    const requestedMobile =
      String(
        searchParams.get(
          "salesmanNumber"
        ) || ""
      ).trim();


    const selectedDate =
      String(
        searchParams.get(
          "date"
        ) || ""
      ).trim();


    // =========================
    // STAFF OPTIONS
    // =========================

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
    // SELECTED SALESMAN
    // =========================

    let selectedSalesman;


    // SALESMAN
    // ALWAYS OWN DATA

    if (
      user.role ===
      "salesman"
    ) {

      selectedSalesman =
        user;

    }

    // MANAGER / ADMIN

    else {

      const mobile =
        requestedMobile ||
        user.mobile;


      selectedSalesman =
        staffOptions.find(
          (staff) =>
            String(
              staff.mobile
            ) ===
            String(
              mobile
            )
        );


      if (
        !selectedSalesman
      ) {

        selectedSalesman =
          staffOptions[0];

      }


      if (
        !selectedSalesman
      ) {

        return Response.json(
          {
            success: false,

            message:
              "No staff found",
          },
          {
            status: 404,
          }
        );

      }

    }


    // =========================
    // DATE RANGE
    //
    // Date selected:
    // only that day
    //
    // No date:
    // today + previous 6 days
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

    const sales =
      await DirectSale.find({

        "salesman.number":
          selectedSalesman.mobile,


        // date is already YYYY-MM-DD
        date: {

          $gte:
            from,

          $lte:
            to,

        },

      })
        .lean();


    // =========================
    // CREATE DAY MAP
    // =========================

    const dayMap =
      new Map();


    let currentDate =
      from;


    while (
      currentDate <= to
    ) {

      dayMap.set(
        currentDate,
        {

          day:
            getDayName(
              currentDate
            ),

          date:
            currentDate,

          totalCustomers:
            0,

          totalAmount:
            0,

        }
      );


      currentDate =
        addDays(
          currentDate,
          1
        );

    }


    // =========================
    // CALCULATE
    // =========================

    let totalCustomers =
      0;


    let totalAmount =
      0;


    sales.forEach(
      (sale) => {

        const customerCount =
          Number(
            sale.customer ||
            0
          );


        const saleAmount =
          Number(
            sale.sale ||
            0
          );


        // TOTAL

        totalCustomers +=
          customerCount;


        totalAmount +=
          saleAmount;


        // DATE WISE

        const day =
          dayMap.get(
            sale.date
          );


        if (!day) {
          return;
        }


        day.totalCustomers +=
          customerCount;


        day.totalAmount +=
          saleAmount;

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


      selectedSalesman: {

        name:
          selectedSalesman.name,

        mobile:
          selectedSalesman.mobile,

        role:
          selectedSalesman.role,

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


      filter: {

        date:
          selectedDate,

      },


      range: {

        from,

        to,

      },


      summary: {

        totalCustomers,

        totalAmount,

      },


      daily:
        Array.from(
          dayMap.values()
        ),

    });

  }
  catch (error) {

    console.error(
      "Direct Sales Report Error:",
      error
    );


    return Response.json(
      {

        success: false,

        message:
          error.message ||
          "Failed to load direct sales report",

      },
      {
        status: 500,
      }
    );

  }

}