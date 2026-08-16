import connectDB from "@/lib/mongodb";
import Medicine from "@/models/medicine";

import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import User from "@/models/user";


export const runtime = "nodejs";



// =============================
// FORMAT MEDICINE NAME
// =============================

function formatMedicineName(text) {

  return text
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char =>
      char.toUpperCase()
    );

}



// =============================
// CREATE SEARCH NAME
// =============================

function createSearchName(text) {

  return text
    .trim()
    .toLowerCase();

}




export async function POST(request) {


  try {


    const body =
      await request.json();



    const {
      name,
      salePrice
    } = body;




    if (!name || salePrice === undefined) {


      return Response.json(

        {
          success:false,
          message:"Medicine name and price required"
        },

        {
          status:400
        }

      );

    }





    // =============================
    // GET SESSION USER
    // =============================


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
          message:"Not logged in"
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





    // =============================
    // FORMAT NAME
    // =============================


    const medicineName =
      formatMedicineName(name);



    const searchName =
      createSearchName(name);







    // =============================
    // DUPLICATE CHECK
    // =============================


    const existingMedicine =
      await Medicine.findOne({

        searchName

      });





    if(existingMedicine){


      return Response.json(

        {
          success:false,

          message:
          "Medicine already exists",

          medicine:
          existingMedicine

        },

        {
          status:409
        }

      );


    }







    // =============================
    // CREATE MEDICINE
    // =============================


    const medicine =
      await Medicine.create({

        name:medicineName,

        searchName,

        salePrice:Number(
          salePrice
        ),


        createdBy:{

          name:user?.name || "",

          mobile:user?.mobile || ""

        },


        updatedBy:{

          name:user?.name || "",

          mobile:user?.mobile || ""

        },


      });








    return Response.json({

      success:true,

      message:
      "Medicine added successfully",

      medicine

    });





  }

  catch(error){


    console.error(
      "Add Medicine Error:",
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