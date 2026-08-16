import connectDB from "@/lib/mongodb";

import Medicine from "@/models/medicine";

import MedicineUpdate from "@/models/medicineUpdate";

import { cookies } from "next/headers";

import {
  verifySessionToken,
} from "@/lib/auth";

import User from "@/models/user";


export const runtime = "nodejs";





export async function POST(){


  try{


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
        "name mobile role"
      )
      .lean();







    // =========================
    // GET PENDING LIST
    // =========================


    let filter = {};



    // Admin সব approve করতে পারবে

    if(
      user.role === "admin"
    ){


      filter={
        status:"pending"
      };


    }


    else{


      filter={

        status:"pending",

        "createdBy.mobile":
          user.mobile

      };


    }








    const updates =
      await MedicineUpdate.find(
        filter
      );







    if(
      updates.length === 0
    ){


      return Response.json({

        success:false,

        message:
        "No pending update found"

      });


    }








    // =========================
    // PROCESS UPDATE
    // =========================


    for(
      const item of updates
    ){



      // =====================
      // PRICE UPDATE
      // =====================


      if(
        item.type ===
        "price_update"
      ){



        await Medicine.updateOne(

          {
            _id:
            item.medicineId
          },


          {

            $set:{


              salePrice:
              item.newPrice,


              updatedBy:{

                name:
                user.name,


                mobile:
                user.mobile

              }


            }

          }


        );


      }








      // =====================
      // NEW MEDICINE
      // =====================


      if(
        item.type ===
        "new_medicine"
      ){



        await Medicine.create({

          name:
          item.medicineName,


          searchName:
          item.medicineName
          .toLowerCase()
          .trim(),



          salePrice:
          item.newPrice,



          isActive:true,



          createdBy:
          item.createdBy,



          updatedBy:{

            name:
            user.name,

            mobile:
            user.mobile

          }



        });



      }






      // =====================
      // REMOVE AFTER UPDATE
      // =====================


      await MedicineUpdate.deleteOne({

        _id:
        item._id

      });



    }








    return Response.json({

      success:true,

      message:
      "Medicine updated successfully",

      updatedCount:
      updates.length

    });







  }


  catch(error){



    console.error(
      "Update All Medicine Error:",
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