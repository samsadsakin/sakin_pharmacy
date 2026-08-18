import connectDB from "@/lib/mongodb";
import User from "@/models/user";


export const runtime = "nodejs";


export async function GET(request) {

  try {

    await connectDB();


    const { searchParams } =
      new URL(request.url);


    const mobile =
      String(
        searchParams.get("mobile") || ""
      ).trim();


    if (!mobile) {

      return Response.json({
        success: true,
        user: null,
      });

    }


    const user =
      await User.findOne({
        mobile,
        isActive: true,
      })
        .select("name mobile")
        .lean();


    if (!user) {

      return Response.json({
        success: true,
        user: null,
      });

    }


    return Response.json({

      success: true,

      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },

    });


  } catch (error) {

    console.error(
      "Customer Mobile Search Error:",
      error
    );


    return Response.json(
      {
        success: false,
        message: "Failed to find customer",
      },
      {
        status: 500,
      }
    );

  }

}