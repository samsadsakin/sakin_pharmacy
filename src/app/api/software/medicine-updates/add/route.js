import connectDB from "@/lib/mongodb";

import MedicineUpdate from "@/models/medicineUpdate";

import { cookies } from "next/headers";

import {
  verifySessionToken,
} from "@/lib/auth";

import User from "@/models/user";


export const runtime = "nodejs";





export async function POST(request){


  try{


    const body =
      await request.json();



    const {

      medicineId,

      medicineName,

      type,

      oldPrice,

      newPrice

    } = body;





    if(
      !medicineName ||
      !type ||
      newPrice === undefined
    ){


      return Response.json(

        {
          success:false,

          message:
          "Required data missing"
        },

        {
          status:400
        }

      );


    }







    // =========================
    // SESSION USER
    // =========================


    const cookieStore =
      await cookies();



    const token =
      cookieStore.get(
        "customer_session"
      )?.value;




    if(!token){


      return Response.json(

        {
          success:false,

          message:
          "Not logged in"
        },

        {
          status:401
        }

      );


    }






    const session =
      await verifySessionToken(
        token
      );




    await connectDB();





    const user =
      await User.findById(
        session.userId
      )
      .select(
        "name mobile"
      )
      .lean();








    // =========================
    // DUPLICATE PENDING CHECK
    // =========================


    const existing =
      await MedicineUpdate.findOne({

        medicineName,

        status:"pending"

      });






    if(existing){


      return Response.json(

        {

          success:false,

          message:
          "This medicine already pending"

        },

        {
          status:409
        }

      );


    }







    // =========================
    // CREATE PENDING
    // =========================


    const update =
      await MedicineUpdate.create({

        medicineId:
          medicineId || null,


        medicineName,


        type,


        oldPrice:
          oldPrice ?? null,


        newPrice:
          Number(newPrice),



        createdBy:{


          name:
          user?.name || "",



          mobile:
          user?.mobile || ""


        },


        status:"pending"


      });









    return Response.json(

      {

        success:true,

        message:
        "Added to pending update",

        update

      }

    );







  }

  catch(error){


    console.error(
      "Medicine Update Add Error:",
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