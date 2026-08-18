import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";

import Medicine from "@/models/medicine";

import MedicineUpdate from "@/models/medicineUpdate";

import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime="nodejs";



export async function POST(){


try{


await connectDB();



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

},
{
status:401
});

}



const session =
await verifySessionToken(token);



if(!session?.userId){

return Response.json({

success:false,

message:"Invalid session"

},
{
status:401
});

}





const user =
await User.findById(
session.userId
)
.select(
"name mobile"
)
.lean();




if(!user){

return Response.json({

success:false,

message:"User not found"

},
{
status:401
});

}






// =========================
// GET PENDING
// =========================


const updates =
await MedicineUpdate.find({

status:"pending"

});





let updatedCount = 0;






// =========================
// PROCESS UPDATE
// =========================


for(const update of updates){



// =========================
// PRICE UPDATE
// =========================


if(
update.type==="price_update"
){



await Medicine.findByIdAndUpdate(

update.medicineId,

{


salePrice:
update.newPrice,


updatedBy:{

name:
user.name,


mobile:
user.mobile

}

}

);



}







// =========================
// NEW MEDICINE
// =========================


if(
update.type==="new_medicine"
){



await Medicine.create({

name:
update.medicineName,


searchName:
update.medicineName
.toLowerCase(),


salePrice:
update.newPrice,


isActive:true,


createdBy:{

name:
user.name,


mobile:
user.mobile

},


updatedBy:{

name:
user.name,


mobile:
user.mobile

}



});


}







// =========================
// APPROVE UPDATE
// =========================


await MedicineUpdate.findByIdAndUpdate(

update._id,

{

status:"approved"

}

);



updatedCount++;



}







return Response.json({

success:true,

message:
`${updatedCount} medicine updated successfully`

});





}
catch(error){


console.error(
"Update All Error:",
error
);


return Response.json({

success:false,

message:
error.message ||
"Update failed"

},
{
status:500
});


}


}