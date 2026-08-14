import connectDB
from "@/lib/mongodb";


import {
 getNextInvoiceNumber
}
from "@/lib/invoiceCounter";



export const runtime =
"nodejs";




export async function GET(){


try{


await connectDB();



const invoiceNo =

await getNextInvoiceNumber();




return Response.json({

success:true,

invoiceNo,


});


}



catch(error){


console.error(
"Invoice Number Error:",
error
);



return Response.json({

success:false,

message:error.message,

},{

status:500

});


}



}