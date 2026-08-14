import Counter from "@/models/Counter";



const COUNTER_ID =
"invoice";



export async function getNextInvoiceNumber(){


const counter =

await Counter.findOneAndUpdate(

{
  _id:COUNTER_ID
},


{

$inc:{
  sequence:1
}

},


{

new:true,

upsert:true

}

);



return counter.sequence;


}