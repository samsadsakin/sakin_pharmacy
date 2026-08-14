import mongoose from "mongoose";


// ================= MEDICINE =================

const MedicineSchema = new mongoose.Schema(
  {
    sl: Number,

    medicine: String,

    qty: Number,

    rate: Number,

    percentageDiscount: Number,

    amount: Number,

  },
  {
    _id: false
  }
);



// ================= CUSTOMER =================

const CustomerSchema = new mongoose.Schema(
  {
    name: String,

    moreInfo: String,

    phone: String,

  },
  {
    _id: false
  }
);



// ================= SELLER =================

const SellerSchema = new mongoose.Schema(
  {

    name: String,

    number: String,

  },
  {
    _id: false
  }
);



// ================= OPTIONS =================

const OptionsSchema = new mongoose.Schema(
  {
    sms: Boolean,

    smsType: String,

    print: Boolean,

    paid: Boolean,

  },
  {
    _id: false
  }
);



// ================= INVOICE =================

const InvoiceSchema = new mongoose.Schema(
  {

    invoiceNo: String,


    date: Date,



    // NEW
    seller: SellerSchema,



    // NEW
    invoiceType: {
      type: String,

      enum: [
        "regular",
        "kemo"
      ],

      default: "regular",
    },



    customer: CustomerSchema,



    medicines: [
      MedicineSchema
    ],



    total: Number,


    discount: Number,


    payableAmount: Number,



    options: OptionsSchema,


  },
  {
    timestamps: true,
  }
);


export default mongoose.models.Invoice ||

mongoose.model(
  "Invoice",
  InvoiceSchema
);