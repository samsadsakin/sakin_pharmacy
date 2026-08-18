import connectDB from "@/lib/mongodb";
import Medicine from "@/models/medicine";

export const runtime = "nodejs";


// =========================
// ESCAPE REGEX
// =========================

function escapeRegex(text) {

  return String(text || "")
    .replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

}


// =========================
// GET MEDICINES
// =========================

export async function GET(request) {

  try {

    await connectDB();


    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    // =========================
    // PAGE
    // =========================

    const page =
      Math.max(
        Number(
          searchParams.get(
            "page"
          )
        ) || 1,
        1
      );


    // =========================
    // LIMIT
    // MAX 50
    // =========================

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


    const skip =
      (
        page - 1
      ) *
      limit;


    // =========================
    // SEARCH
    // =========================

    const q =
      String(
        searchParams.get(
          "q"
        ) || ""
      )
        .trim()
        .replace(
          /\s+/g,
          " "
        );


    const filter = {};


    if (q) {

      const regex =
        new RegExp(
          escapeRegex(q),
          "i"
        );


      filter.$or = [

        {
          name: regex,
        },

        {
          searchName:
            regex,
        },

      ];

    }


    // =========================
    // TOTAL
    // =========================

    const total =
      await Medicine.countDocuments(
        filter
      );


    // =========================
    // LATEST 50
    // =========================

    const medicines =
      await Medicine.find(
        filter
      )
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();


    // =========================
    // TOTAL PAGES
    // =========================

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

      medicines,

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
      "Medicine View Error:",
      error
    );


    return Response.json(
      {

        success: false,

        message:
          "Failed to load medicines",

      },
      {
        status: 500,
      }
    );

  }

}