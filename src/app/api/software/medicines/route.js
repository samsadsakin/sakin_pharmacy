import connectDB from "@/lib/mongodb";
import Medicine from "@/models/medicine";

export const runtime = "nodejs";


export async function GET() {

  try {

    await connectDB();


    const medicines =
      await Medicine.find({})
        .sort({
          name: 1,
        })
        .lean();


    return Response.json({
      success: true,
      medicines,
    });

  }
  catch (error) {

    console.error(
      "Medicine List Error:",
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