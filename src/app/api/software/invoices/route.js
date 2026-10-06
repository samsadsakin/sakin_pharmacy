import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";
import Medicine from "@/models/medicine";
import { sendSMS } from "@/lib/(sms)/sms";
import { createInvoiceSMS } from "@/lib/(sms)/smsMessage";

// ================= GET ALL & FILTERED INVOICES =================
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const invoiceSearch = searchParams.get("invoiceSearch");
    const customerPhone = searchParams.get("customerPhone");
    const customerName = searchParams.get("customerName");
    const invoiceType = searchParams.get("invoiceType");
    const singleDate = searchParams.get("singleDate") || searchParams.get("date");
    const smsFilter = searchParams.get("smsFilter");
    const paidFilter = searchParams.get("paidFilter");

    let query = {};

    if (invoiceSearch) {
      query.invoiceNo = { $regex: invoiceSearch,$options: "i" };
    }

    if (customerPhone) {
      query["customer.phone"] = { $regex: customerPhone,$options: "i" };
    }

    if (customerName) {
      query["customer.name"] = { $regex: customerName,$options: "i" };
    }

    if (invoiceType) {
      query.invoiceType = invoiceType;
    }

    // =========================================================
    // EXACT DATE FILTER (BD Timezone + Standard UTC Safe Range)
    // =========================================================
    if (singleDate) {
      // YYYY-MM-DD ফরম্যাটের জন্য বাংলাদেশ সময় অনুযায়ী স্টার্ট ও এন্ড ফিল্টার
      const startOfDay = new Date(`${singleDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${singleDate}T23:59:59.999Z`);

      query.$or = [
        { date: { $gte: startOfDay,$lte: endOfDay } },
        { createdAt: { $gte: startOfDay,$lte: endOfDay } },
      ];
    }

    if (smsFilter !== null && smsFilter !== "" && smsFilter !== undefined) {
      query["options.sms"] = smsFilter === "true";
    }

    if (paidFilter !== null && paidFilter !== "" && paidFilter !== undefined) {
      query["options.paid"] = paidFilter === "true";
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.error("GET Invoices Error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ================= CREATE INVOICE & CONDITIONAL PENDING UPDATES =================
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      invoiceNo,
      date,
      seller,
      invoiceType,
      customer,
      medicines,
      total,
      discount,
      payableAmount,
      options,
    } = body;

    // 1. SAVE INVOICE
    const newInvoice = await Invoice.create({
      invoiceNo,
      date,
      seller,
      invoiceType,
      customer,
      medicines,
      total,
      discount,
      payableAmount,
      options,
    });

    // 2. CHECK MEDICINES: NEW OR PRICE CHANGED -> PUSH TO PENDING UPDATES
    if (medicines && Array.isArray(medicines) && medicines.length > 0) {
      const baseUrl = request.nextUrl ? request.nextUrl.origin : "http://localhost:3000";

      for (const med of medicines) {
        if (!med.medicine) continue;

        try {
          let existingMed = null;

          if (med.medicineId) {
            existingMed = await Medicine.findById(med.medicineId);
          } else {
            existingMed = await Medicine.findOne({ name: med.medicine });
          }

          const priceChanged = !existingMed || Number(existingMed.salePrice) !== Number(med.rate);

          if (priceChanged) {
            await fetch(`${baseUrl}/api/software/medicine-updates/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                medicineId: med.medicineId || existingMed?._id || "",
                medicine: med.medicine,
                name: med.medicine,
                salePrice: Number(med.rate),
                rate: Number(med.rate),
                qty: Number(med.qty),
              }),
            });
            console.log(`[PENDING UPDATE ADDED] Medicine: ${med.medicine}`);
          }
        } catch (checkErr) {
          console.error(`Error checking medicine update for ${med.medicine}:`, checkErr);
        }
      }
    }

    // 3. BULK SMS TRIGGER
    if (options?.sms && customer?.phone) {
      try {
        const smsContent = createInvoiceSMS(body);
        await sendSMS({
          mobile: customer.phone,
          message: smsContent,
        });
        console.log("SMS sent successfully to:", customer.phone);
      } catch (smsError) {
        console.error("SMS Sending Error:", smsError.message);
      }
    }

    return Response.json(
      {
        success: true,
        message: "Invoice saved successfully",
        invoice: newInvoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save Invoice Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to save invoice",
      },
      { status: 500 }
    );
  }
}