import mongoose from "mongoose";


const medicineSchema = new mongoose.Schema(

  {

    // Display name
    // Example: Napa Tablet 500mg
    name: {
      type: String,
      required: true,
      trim: true,
    },


    // Search করার জন্য lowercase version
    // Example: napa tablet 500mg
    searchName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },


    // Selling price
    salePrice: {
      type: Number,
      required: true,
      default: 0,
    },


    // Medicine active/inactive
    isActive: {
      type: Boolean,
      default: true,
    },


    // কে তৈরি করেছে
    createdBy: {

      name: {
        type: String,
      },

      mobile: {
        type: String,
      },

    },


    // কে last update করেছে
    updatedBy: {

      name: {
        type: String,
      },

      mobile: {
        type: String,
      },

    },


  },

  {

    timestamps: true,

  }

);



const Medicine =
  mongoose.models.Medicine ||
  mongoose.model(
    "Medicine",
    medicineSchema
  );


export default Medicine;