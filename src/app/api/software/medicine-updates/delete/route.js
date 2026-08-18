import connectDB from "@/lib/mongodb";

import MedicineUpdate from "@/models/medicineUpdate";


export const runtime = "nodejs";





export async function DELETE(request){


  try{


    await connectDB();




    const body =
      await request.json();



    const id =
      body.id;





    if(!id){


      return Response.json(

        {

          success:false,

          message:
          "Update id missing"

        },

        {

          status:400

        }

      );


    }







    const deleted =

      await MedicineUpdate.findByIdAndDelete(

        id

      );







    if(!deleted){


      return Response.json(

        {

          success:false,

          message:
          "Medicine update not found"

        },

        {

          status:404

        }

      );


    }








    return Response.json(

      {

        success:true,

        message:
        "Medicine update deleted successfully"

      }

    );





  }


  catch(error){



    console.log(

      "Delete Medicine Update Error:",

      error

    );




    return Response.json(

      {

        success:false,

        message:
        "Server error"

      },

      {

        status:500

      }

    );


  }


}