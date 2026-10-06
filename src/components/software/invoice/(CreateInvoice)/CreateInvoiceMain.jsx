"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getDhakaDateOnly } from "@/lib/date";
import InvoiceFormDrawer, {
  emptyCustomer,
  emptyMedicine,
  defaultOptions,
  getAmount,
  money,
} from "./InvoiceFormDrawer";

let nextId = 1;

export default function CreateInvoiceMain() {
  const router = useRouter();
  const invoiceLoaded = useRef(false);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [seller, setSeller] = useState({ name: "", number: "" });
  const [invoiceType, setInvoiceType] = useState("regular");

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [item, setItem] = useState({ ...emptyMedicine });
  const [rows, setRows] = useState([]);
  const [payable, setPayable] = useState("");
  const [options, setOptions] = useState({ ...defaultOptions });

  useEffect(() => {
    if (invoiceLoaded.current) return;
    invoiceLoaded.current = true;

    setInvoiceDate(getDhakaDateOnly());
    loadInvoiceNumber();
    loadSeller();
  }, []);

  const loadInvoiceNumber = async () => {
    try {
      const res = await fetch("/api/software/invoices/next", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setInvoiceNo(data.invoiceNo);
      }
    } catch (error) {
      console.log("Invoice Number Error", error);
    }
  };

  const loadSeller = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setSeller({
          name: data.user.name,
          number: data.user.mobile,
        });

        if (data.user.mobile === "01724621816") {
          setInvoiceType("kemo");
        } else {
          setInvoiceType("regular");
        }
      }
    } catch (error) {
      console.log("Seller Load Error", error);
    }
  };

  const addMedicine = () => {
    if (!item.medicine || Number(item.qty) <= 0 || Number(item.rate) <= 0) {
      return;
    }

    setRows([
      ...rows,
      {
        id: nextId++,
        medicineId: item.medicineId || "",
        medicine: item.medicine,
        qty: item.qty,
        rate: item.rate,
        dis: item.dis,
      },
    ]);

    setItem({ ...emptyMedicine });
  };

  const deleteMedicine = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const resetInvoice = () => {
    setCustomer({ ...emptyCustomer });
    setItem({ ...emptyMedicine });
    setRows([]);
    setPayable("");
    setOptions({ ...defaultOptions });
    nextId = 1;
  };

  const total = rows.reduce((sum, row) => sum + getAmount(row), 0);
  const payableAmount = payable === "" ? total : Number(payable || 0);
  const discount = Math.max(total - payableAmount, 0);

  const saveInvoice = async () => {
    const shouldPrint = options.print;

    const data = {
      invoiceNo,
      date: invoiceDate,
      seller,
      invoiceType,
      customer,
      medicines: rows.map((row, index) => ({
        sl: index + 1,
        medicine: row.medicine,
        medicineId: row.medicineId || "",
        qty: Number(row.qty),
        rate: Number(row.rate),
        percentageDiscount: Number(row.dis || 0),
        amount: getAmount(row),
      })),
      total,
      discount,
      payableAmount,
      options: {
        sms: options.sms,
        ...(options.sms && { smsType: options.smsType }),
        print: options.print,
        paid: options.paid,
      },
    };

    console.log("Invoice Data:", data);

    try {
      const res = await fetch("/api/software/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Server Response Error:", text);
        await Swal.fire({
          title: "Failed",
          text: "API endpoint returned an invalid response",
          icon: "error",
        });
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        await Swal.fire({
          title: "Failed",
          text: result.message || "Failed to save invoice",
          icon: "error",
        });
        return;
      }

      const invoiceId = result.invoice?._id;

      if (!invoiceId) {
        await Swal.fire({
          title: "Error",
          text: "Invoice ID not found",
          icon: "error",
        });
        return;
      }

      resetInvoice();
      loadInvoiceNumber();

      if (shouldPrint) {
        await Swal.fire({
          title: "Saved!",
          text: "Invoice saved successfully",
          icon: "success",
          timer: 700,
          showConfirmButton: false,
        });

        router.push(`/software/Invoice/PrintInvoice/${invoiceId}`);
        return;
      }

      await Swal.fire({
        title: "Saved!",
        text: "Invoice saved successfully",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Save Invoice Error:", error);
      await Swal.fire({
        title: "Error",
        text: "Failed to save invoice",
        icon: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/40 to-indigo-50/30 p-3 md:p-6 text-slate-700">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white/85 backdrop-blur-2xl p-4 md:p-6 shadow-2xl border border-white/80 space-y-5">
        <h1 className="text-center text-xl md:text-2xl font-extrabold bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
          Create Invoice
        </h1>

        {/* INVOICE HEADER */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-50/80 via-blue-50/40 to-indigo-50/50 backdrop-blur-md p-3.5 md:p-4 border border-sky-100/90 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white/90 p-3 shadow-2xs border border-slate-100 transition hover:shadow-sm">
              <p className="text-xs text-slate-400">Invoice No</p>
              <p className="mt-1 text-sm font-semibold text-sky-700">
                {invoiceNo || "-"}
              </p>
            </div>

            {/* DATE (FIXED: REFERENCE ERROR RESOLVED) */}
            <div className="rounded-xl bg-white/90 p-3 shadow-2xs border border-slate-100 transition hover:shadow-sm">
              <p className="text-xs text-slate-400">Date</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {invoiceDate || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-white/90 p-3 shadow-2xs border border-slate-100 transition hover:shadow-sm">
              <p className="text-xs text-slate-400">Seller Name</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700 truncate">
                {seller?.name || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-white/90 p-3 shadow-2xs border border-slate-100 transition hover:shadow-sm">
              <p className="text-xs text-slate-400">Invoice Type</p>
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer focus:text-sky-700"
              >
                <option value="regular">Regular</option>
                <option value="kemo">Kemo</option>
                <option value="somajseba">Somajseba</option>
              </select>
            </div>
          </div>
        </div>

        {/* MEDICINE TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-sky-100/80 shadow-sm bg-white/80 backdrop-blur-md">
          <table className="w-full min-w-[550px] text-xs md:text-sm">
            <thead className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 text-white shadow-xs">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">SL</th>
                <th className="px-4 py-3 text-left font-semibold">Medicine</th>
                <th className="px-4 py-3 text-right font-semibold">Qty</th>
                <th className="px-4 py-3 text-right font-semibold">Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Dis</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-center font-semibold">✕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No medicine added
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-sky-50/60 transition duration-150">
                    <td className="px-4 py-3 text-center text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs font-medium text-slate-700 break-words">
                        {row.medicine || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{row.qty}</td>
                    <td className="px-4 py-3 text-right">৳ {money(row.rate)}</td>
                    <td className="px-4 py-3 text-right">{row.dis || 0}%</td>
                    <td className="px-4 py-3 text-right font-bold text-sky-800">
                      ৳ {money(getAmount(row))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteMedicine(row.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 mx-auto"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENT DRAWER PANEL */}
        <InvoiceFormDrawer
          customer={customer}
          setCustomer={setCustomer}
          item={item}
          setItem={setItem}
          addMedicine={addMedicine}
          total={total}
          discount={discount}
          payable={payable}
          setPayable={setPayable}
          options={options}
          setOptions={setOptions}
          saveInvoice={saveInvoice}
          disabledSave={!rows.length}
        />
      </div>
    </main>
  );
}