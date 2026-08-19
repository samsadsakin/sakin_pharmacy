import mongoose from "mongoose";


const directSaleSchema =
  new mongoose.Schema(
    {
      sale: {
        type: Number,
        required: true,
        min: 1,
      },

      customer: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },

      salesman: {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        number: {
          type: String,
          required: true,
          trim: true,
        },
      },

      addedBy: {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        number: {
          type: String,
          required: true,
          trim: true,
        },
      },

      date: {
        type: String,
        required: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );


const DirectSale =
  mongoose.models.DirectSale ||
  mongoose.model(
    "DirectSale",
    directSaleSchema
  );


export default DirectSale;