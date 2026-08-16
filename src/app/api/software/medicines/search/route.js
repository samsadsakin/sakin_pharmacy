import connectDB from "@/lib/mongodb";
import Medicine from "@/models/medicine";


export const runtime = "nodejs";



export async function GET(request) {


  try {


    await connectDB();



    const { searchParams } =
      new URL(request.url);



    const query =
      String(
        searchParams.get("q") || ""
      )
      .trim()
      .toLowerCase();





    if(!query){


      return Response.json({

        success:true,

        medicines:[]

      });


    }






    const medicines =
      await Medicine
      .find({

        searchName:{

          $regex:query,

          $options:"i"

        },

        isActive:true

      })

      .select(

        "name salePrice"

      )

      .limit(20)

      .lean();







    return Response.json({

      success:true,

      medicines

    });







  }

  catch(error){


    console.error(
      "Medicine Search Error:",
      error
    );



    return Response.json(

      {

        success:false,

        message:"Server error"

      },

      {

        status:500

      }

    );


  }


}