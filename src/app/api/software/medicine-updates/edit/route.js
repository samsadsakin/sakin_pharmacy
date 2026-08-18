import connectDB from "@/lib/mongodb";

import MedicineUpdate from "@/models/medicineUpdate";

import { cookies } from "next/headers";

import {
  verifySessionToken,
} from "@/lib/auth";

import User from "@/models/user";



export const runtime = "nodejs";






export async function PUT(request){


  try{


    await connectDB();






    // =========================
    // SESSION CHECK
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







    if(!session?.userId){


      return Response.json(

        {

          success:false,

          message:
          "Invalid session"

        },

        {

          status:401

        }

      );


    }








    const user =

      await User.findById(

        session.userId

      )

      .select(
        "name mobile"
      )

      .lean();







    const body =
      await request.json();







    const {

      id,

      medicineName,

      newPrice


    } = body;









    if(!id){


      return Response.json(

        {

          success:false,

          message:
          "Update id missing"

        }

      );


    }










    // =========================
    // UPDATE PENDING DATA
    // =========================


    const updated =

      await MedicineUpdate.findByIdAndUpdate(

        id,

        {


          $set:{



            medicineName:
              String(
                medicineName || ""
              ),




            newPrice:
              Number(
                newPrice || 0
              ),





            updatedBy:{


              name:
                user?.name || "",



              mobile:
                user?.mobile || ""


            }




          }



        },


        {

          new:true

        }

      );










    if(!updated){


      return Response.json(

        {

          success:false,

          message:
          "Update not found"

        }

      );


    }










    return Response.json(

      {

        success:true,


        message:
        "Medicine update saved",



        update:
        updated


      }

    );






  }


  catch(error){



    console.log(

      "Edit Medicine Update Error:",

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