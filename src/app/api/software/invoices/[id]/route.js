import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";

export const runtime = "nodejs";

// ================= GET ONE =================
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return Response.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, invoice });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ================= UPDATE PAID STATUS (PATCH) =================
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Body theke data secure vabe parse kora
    const body = await request.json().catch(() => ({}));
    const paidValue = body.paid !== undefined ? body.paid : true;

    // Find invoice and update options.paid directly using dot notation
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        $set: {
          "options.paid": Boolean(paidValue),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return Response.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Invoice successfully marked as paid",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("PATCH Invoice Error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return Response.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}