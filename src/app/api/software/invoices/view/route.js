import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";
import User from "@/models/user";
import Medicine from "@/models/medicine";
import MedicineUpdate from "@/models/medicineUpdate";
import { verifySessionToken } from "@/lib/auth";
import { sendSMS } from "@/lib/(sms)/sendSMS";
import { createInvoiceSMS } from "@/lib/(sms)/smsMessage";

export const runtime = "nodejs";

function normalizeMedicineName(text) {
  return String(text || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function formatMedicineName(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// =========================
// POST METHOD
// =========================
export async function POST(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;

    if (!token) {
      return Response.json({ success: false, message: "Not logged in" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return Response.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const user = await User.findById(session.userId).select("name mobile role").lean();
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const data = await request.json();

    const customerName = String(data.customer?.name || "").trim();
    const customerMobile = String(data.customer?.phone || "").replace(/\D/g, "").trim();

    if (customerName && customerMobile) {
      const existingCustomer = await User.findOne({ mobile: customerMobile });

      if (existingCustomer) {
        if (existingCustomer.role === "customer" && existingCustomer.name !== customerName) {
          existingCustomer.name = customerName;
          await existingCustomer.save();
        }
      } else {
        await User.create({
          name: customerName,
          mobile: customerMobile,
          role: "customer",
          isActive: true,
        });
      }
    }

    const invoiceData = {
      invoiceNo: String(data.invoiceNo || ""),
      date: data.date ? new Date(data.date) : new Date(),
      seller: {
        name: String(user.name || ""),
        number: String(user.mobile || ""),
      },
      invoiceType: data.invoiceType || "regular",
      customer: {
        name: customerName,
        moreInfo: data.customer?.moreInfo || "",
        phone: customerMobile,
      },
      medicines: Array.isArray(data.medicines) ? data.medicines : [],
      total: Number(data.total || 0),
      discount: Number(data.discount || 0),
      payableAmount: Number(data.payableAmount || 0),
      options: {
        sms: Boolean(data.options?.sms),
        smsType: data.options?.smsType || "short",
        print: Boolean(data.options?.print),
        paid: Boolean(data.options?.paid),
      },
    };

    const invoice = await Invoice.create(invoiceData);

    try {
      if (Array.isArray(data.medicines)) {
        for (const medicine of data.medicines) {
          const medicineName = String(medicine.medicine || "").trim().replace(/\s+/g, " ");
          const newPrice = Number(medicine.rate);

          if (!medicineName || !Number.isFinite(newPrice) || newPrice < 0) continue;

          const searchName = normalizeMedicineName(medicineName);
          let existingMedicine = null;

          if (medicine.medicineId) {
            try {
              const medicineById = await Medicine.findById(medicine.medicineId).lean();
              if (medicineById && normalizeMedicineName(medicineById.name) === searchName) {
                existingMedicine = medicineById;
              }
            } catch (idError) {
              console.log("Medicine ID lookup skipped:", medicine.medicineId);
            }
          }

          if (!existingMedicine) {
            existingMedicine = await Medicine.findOne({ searchName, isActive: true }).lean();
          }

          if (existingMedicine) {
            const oldPrice = Number(existingMedicine.salePrice || 0);
            if (oldPrice === newPrice) continue;

            const existingPending = await MedicineUpdate.findOne({
              medicineId: existingMedicine._id,
              type: "price_update",
              newPrice: newPrice,
              status: "pending",
              "createdBy.mobile": user.mobile,
            }).lean();

            if (existingPending) continue;

            await MedicineUpdate.create({
              medicineId: existingMedicine._id,
              medicineName: existingMedicine.name,
              type: "price_update",
              oldPrice,
              newPrice,
              createdBy: { name: user.name || "", mobile: user.mobile || "" },
              status: "pending",
            });

            continue;
          }

          const displayName = formatMedicineName(medicineName);
          const nameRegex = new RegExp(`^${escapeRegex(displayName)}$`, "i");

          const existingNewPending = await MedicineUpdate.findOne({
            medicineName: nameRegex,
            type: "new_medicine",
            status: "pending",
            "createdBy.mobile": user.mobile,
          }).lean();

          if (existingNewPending) continue;

          await MedicineUpdate.create({
            medicineId: null,
            medicineName: displayName,
            type: "new_medicine",
            oldPrice: null,
            newPrice,
            createdBy: { name: user.name || "", mobile: user.mobile || "" },
            status: "pending",
          });
        }
      }
    } catch (medicineError) {
      console.error("INVOICE MEDICINE CHECK ERROR:", medicineError);
    }

    if (data.options?.sms && customerMobile) {
      try {
        const smsData = {
          ...data,
          customer: { ...data.customer, name: customerName, phone: customerMobile },
        };
        const message = createInvoiceSMS(smsData);
        await sendSMS(customerMobile, message);
      } catch (smsError) {
        console.error("Invoice SMS Error:", smsError);
      }
    }

    return Response.json(
      { success: true, message: "Invoice saved successfully", invoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice POST Error:", error);
    return Response.json(
      { success: false, message: error?.message || "Failed to save invoice" },
      { status: 500 }
    );
  }
}

// =========================
// GET METHOD (EXACT MATCH FOR INVOICE NO)
// =========================
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Salesman Filter
    const sellerNumber = searchParams.get("sellerNumber");
    if (sellerNumber) {
      query["seller.number"] = sellerNumber;
    }

    // 2. Invoice No Filter (EXACT MATCH)
    const invoiceNo = searchParams.get("invoiceNo") || searchParams.get("invoiceSearch");
    if (invoiceNo?.trim()) {
      query.invoiceNo = invoiceNo.trim();
    }

    // 3. Customer Phone Filter
    const customerPhone = searchParams.get("customerPhone");
    if (customerPhone?.trim()) {
      query["customer.phone"] = { $regex: customerPhone.trim(),$options: "i" };
    }

    // 4. Customer Name Filter
    const customerName = searchParams.get("customerName");
    if (customerName?.trim()) {
      query["customer.name"] = { $regex: customerName.trim(),$options: "i" };
    }

    // 5. Invoice Type Filter
    const typeParam = searchParams.get("type") || searchParams.get("invoiceType");
    if (typeParam) {
      query.invoiceType = typeParam;
    }

    // 6. Single Date Filter OR Date Range Filter (UTC & Timezone Safe)
    const singleDate = searchParams.get("singleDate") || searchParams.get("date");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    if (singleDate) {
      const startOfDay = new Date(`${singleDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${singleDate}T23:59:59.999Z`);

      query.$or = [
        { date: { $gte: startOfDay,$lte: endOfDay } },
        { createdAt: { $gte: startOfDay,$lte: endOfDay } },
      ];
    } else if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // 7. SMS Filter
    const sms = searchParams.get("sms") || searchParams.get("smsFilter");
    if (sms === "true") {
      query["options.sms"] = { $in: [true, "true"] };
    } else if (sms === "false") {
      query["options.sms"] = { $in: [false, "false"] };
    }

    // 8. Paid Filter
    const paid = searchParams.get("paid") || searchParams.get("paidFilter");
    if (paid === "true") {
      query["options.paid"] = { $in: [true, "true"] };
    } else if (paid === "false") {
      query["options.paid"] = { $in: [false, "false"] };
    }

    const total = await Invoice.countDocuments(query);

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return Response.json({
      success: true,
      invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Invoice GET Error:", error);
    return Response.json(
      { success: false, message: error?.message || "Failed to load invoices" },
      { status: 500 }
    );
  }
}