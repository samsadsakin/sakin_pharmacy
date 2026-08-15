import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";

import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";



export async function GET() {

  try {


    // =========================
    // SESSION
    // =========================

    const cookieStore =
      await cookies();


    const token =
      cookieStore.get(
        "customer_session"
      )?.value;



    if(!token){

      return Response.json({

        success:false,
        message:"Not logged in"

      },{
        status:401
      });

    }




    const session =
      await verifySessionToken(
        token
      );



    if(!session?.userId){

      return Response.json({

        success:false,
        message:"Invalid session"

      },{
        status:401
      });

    }




    // =========================
    // USER
    // =========================

    await connectDB();



    const user =
      await User.findById(
        session.userId
      )
      .select(
        "name mobile role"
      )
      .lean();



    if(!user){

      return Response.json({

        success:false,
        message:"User not found"

      },{
        status:404
      });

    }





    const invoicesCollection =
      (await connectDB())
      .connection
      .collection(
        "invoices"
      );



    let invoice;



    // =========================
    // SALESMAN + MANAGER
    // =========================

    if(
      user.role === "salesman" ||
      user.role === "manager"
    ){

      invoice =
        await invoicesCollection.findOne(

          {
            "seller.number":
              user.mobile
          },

          {

            sort:{
              createdAt:-1,
              _id:-1
            }

          }

        );


    }



    // =========================
    // ADMIN
    // =========================

    else if(
      user.role === "admin"
    ){

      invoice =
        await invoicesCollection.findOne(

          {},

          {

            sort:{
              createdAt:-1,
              _id:-1
            }

          }

        );

    }



    else{

      return Response.json({

        success:false,

        message:
        "This account cannot print invoice"

      },{
        status:403
      });

    }





    if(!invoice){

      return Response.json({

        success:false,

        message:
        "No invoice found"

      },{
        status:404
      });

    }





    return Response.json({

      success:true,


      user:{

        name:user.name,

        mobile:user.mobile,

        role:user.role

      },


      invoice:{

        ...invoice,

        _id:
        invoice._id.toString()

      }


    });



  }
  catch(error){


    console.error(
      "Print Invoice Error:",
      error
    );


    return Response.json({

      success:false,

      message:"Server error"

    },{
      status:500
    });


  }


}