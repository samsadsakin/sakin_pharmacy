import mongoose from "mongoose";


const medicineUpdateSchema =
new mongoose.Schema(

{

  medicineId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Medicine",
    default:null
  },


  medicineName:{
    type:String,
    required:true,
    trim:true
  },


  type:{
    type:String,
    enum:[
      "new_medicine",
      "price_update"
    ],
    required:true
  },


  oldPrice:{
    type:Number,
    default:null
  },


  newPrice:{
    type:Number,
    required:true
  },


  createdBy:{


    name:{
      type:String
    },


    mobile:{
      type:String
    }


  },


  status:{
    type:String,
    enum:[
      "pending",
      "approved",
      "cancelled"
    ],
    default:"pending"
  }



},

{

 timestamps:true

}


);



const MedicineUpdate =
mongoose.models.MedicineUpdate ||
mongoose.model(
  "MedicineUpdate",
  medicineUpdateSchema
);



export default MedicineUpdate;