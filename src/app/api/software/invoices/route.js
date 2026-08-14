import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";
import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";


// ================= POST =================

export async function POST(request) {
  try {
    await connectDB();

    // =========================
    // LOGIN SESSION
    // =========================

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "customer_session"
      )?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Not logged in",
        },
        {
          status: 401,
        }
      );
    }


    const session =
      await verifySessionToken(
        token
      );

    if (!session?.userId) {
      return Response.json(
        {
          success: false,
          message: "Invalid session",
        },
        {
          status: 401,
        }
      );
    }


    const user =
      await User.findById(
        session.userId
      )
        .select(
          "name mobile"
        )
        .lean();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }


    // =========================
    // FRONTEND DATA
    // =========================

    const data =
      await request.json();


    // =========================
    // FINAL INVOICE DATA
    // =========================

    const invoiceData = {
      invoiceNo:
        String(
          data.invoiceNo || ""
        ),

      date:
        data.date
          ? new Date(data.date)
          : new Date(),

      seller: {
        name:
          String(
            user.name || ""
          ),

        number:
          String(
            user.mobile || ""
          ),
      },

      invoiceType:
        data.invoiceType === "kemo"
          ? "kemo"
          : "regular",

      customer: {
        name:
          data.customer?.name || "",

        moreInfo:
          data.customer?.moreInfo || "",

        phone:
          data.customer?.phone || "",
      },

      medicines:
        Array.isArray(
          data.medicines
        )
          ? data.medicines
          : [],

      total:
        Number(
          data.total || 0
        ),

      discount:
        Number(
          data.discount || 0
        ),

      payableAmount:
        Number(
          data.payableAmount || 0
        ),

      options: {
        sms:
          Boolean(
            data.options?.sms
          ),

        smsType:
          data.options?.smsType ||
          "short",

        print:
          Boolean(
            data.options?.print
          ),

        paid:
          Boolean(
            data.options?.paid
          ),
      },
    };


    console.log(
      "FINAL INVOICE DATA:",
      invoiceData
    );


    // =========================
    // SAVE
    // =========================
    console.log(
      "BEFORE SAVE:",
      data
    );

    const invoice =
      await Invoice.create(
        invoiceData
      );


    console.log(
      "SAVED INVOICE:",
      invoice.toObject()
    );


    return Response.json(
      {
        success: true,
        message:
          "Invoice saved successfully",
        invoice,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "Invoice POST Error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to save invoice",
      },
      {
        status: 500,
      }
    );
  }
}


// ================= GET =================

export async function GET() {
  try {
    await connectDB();

    const invoices =
      await Invoice.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return Response.json({
      success: true,
      invoices,
    });

  } catch (error) {
    console.error(
      "Invoice GET Error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to load invoices",
      },
      {
        status: 500,
      }
    );
  }
}