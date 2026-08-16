import connectDB from "@/lib/mongodb";

import MedicineUpdate from "@/models/medicineUpdate";

import User from "@/models/user";

import { cookies } from "next/headers";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";





export async function GET(){


  try{


    // =========================
    // GET SESSION
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
        "name mobile role"
      )
      .lean();








    let filter = {};





    // =========================
    // ADMIN
    // ALL PENDING
    // =========================


    if(
      user.role === "admin"
    ){


      filter = {

        status:"pending"

      };


    }





    // =========================
    // STAFF
    // OWN PENDING ONLY
    // =========================


    else{


      filter = {

        status:"pending",


        "createdBy.mobile":
          user.mobile

      };


    }








    const updates =
      await MedicineUpdate.find(
        filter
      )
      .sort({

        createdAt:-1

      })
      .lean();








    return Response.json({

      success:true,

      updates

    });






  }

  catch(error){


    console.error(
      "Get Medicine Updates Error:",
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