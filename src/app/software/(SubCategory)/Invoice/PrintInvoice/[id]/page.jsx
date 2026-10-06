"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Roboto_Condensed } from "next/font/google";

const receiptFont = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function PrintInvoicePage() {
  const params = useParams();
  const id = params?.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PRINT OPTIONS STATE
  // =========================
  const [invoiceType, setInvoiceType] = useState("standard");
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);

  // =========================
  // GET INVOICE (SAFE FETCH)
  // =========================
  useEffect(() => {
    if (!id) return;

    const getInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/software/invoices/${id}`);

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await res.text();
          console.error("Server returned HTML or invalid response:", rawText);
          throw new Error(`Server error (${res.status}): Invalid API route`);
        }

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Invoice not found");
          return;
        }

        setInvoice(data.invoice);
      } catch (err) {
        console.error("Get Invoice Error:", err);
        setError(err.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    getInvoice();
  }, [id]);

  // =========================
  // DYNAMIC CALCULATION
  // =========================
  const basePayable = Number(invoice?.payableAmount || 0);
  const onlineCharge = isOnlinePayment ? (basePayable / 1000) * 12 : 0;
  const finalPayable = basePayable + onlineCharge;

  // =========================
  // POPUP PRINT FUNCTION
  // =========================
  const handlePrintOnlyReceipt = () => {
    const printContent = document.getElementById("print-memo");
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      alert("Please allow popups for this site to print.");
      return;
    }

    const printDocument = printWindow.document;
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Print Invoice - #${invoice?.invoiceNo || ""}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm !important;
              background: #fff !important;
              color: #000 !important;
              font-family: 'Roboto Condensed', sans-serif !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #print-memo {
              width: 80mm !important;
              margin: 0 !important;
              padding: 2mm 3mm !important;
              box-sizing: border-box !important;
            }
            table {
              table-layout: fixed !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printDocument.close();

    printWindow.focus();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };

    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.print();
        printWindow.close();
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading invoice...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-sm text-red-500">{error}</div>
    );
  }

  if (!invoice) return null;

  return (
    <main
      className={`${receiptFont.className} min-h-screen bg-slate-100 py-4`}
    >
      {/* MULTIPLE PRINT OPTIONS CONTROLLER */}
      <div
        className="mx-auto mb-3 bg-white p-3 rounded-lg shadow-sm border border-slate-200 space-y-3"
        style={{ width: "80mm" }}
      >
        <div className="text-xs font-bold text-slate-800 border-b pb-1">
          Print Template & Options:
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="invoiceType"
              value="standard"
              checked={invoiceType === "standard"}
              onChange={() => setInvoiceType("standard")}
              className="accent-sky-700"
            />
            Bangla Standard
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="invoiceType"
              value="cancer"
              checked={invoiceType === "cancer"}
              onChange={() => setInvoiceType("cancer")}
              className="accent-sky-700"
            />
            Cancer Special
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="invoiceType"
              value="english"
              checked={invoiceType === "english"}
              onChange={() => setInvoiceType("english")}
              className="accent-sky-700"
            />
            English Version
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="invoiceType"
              value="somajseba"
              checked={invoiceType === "somajseba"}
              onChange={() => setInvoiceType("somajseba")}
              className="accent-sky-700"
            />
            Somajseba Version
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={isOnlinePayment}
              onChange={(e) => setIsOnlinePayment(e.target.checked)}
              className="w-4 h-4 accent-sky-700 cursor-pointer rounded"
            />
            Online Payment Charge (+12Tk/1000)
          </label>

          <button
            type="button"
            onClick={handlePrintOnlyReceipt}
            className="rounded-lg bg-sky-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-800 shadow-sm transition"
          >
            Print Invoice
          </button>
        </div>
      </div>

      {/* RECEIPT MEMO (PREVIEW) */}
      <div
        id="print-memo"
        className="mx-auto bg-white text-slate-950 shadow-sm"
        style={{
          width: "80mm",
          padding: "3mm",
          boxSizing: "border-box",
        }}
      >
        <header className="text-center">
          {invoiceType === "cancer" && (
            <p className="text-[10px] font-bold text-black mb-0.5">
              বিসমিল্লাহির রাহমানির রাহিম
            </p>
          )}

          <h1 className="text-2xl font-bold tracking-wide leading-tight text-black">
            {invoiceType === "english" ? "SAKIN PHARMACY" : "সাকিন ফার্মেসী"}
          </h1>

          <p className="mt-0.5 text-[13px] font-bold leading-tight text-black">
            {invoiceType === "english"
              ? "Prop: Md. Jahangir Alam"
              : "প্রো: মোঃ জাহাঙ্গীর আলম"}
          </p>

          {invoiceType === "cancer" && (
            <p className="mt-0.5 text-[10px] font-bold leading-tight text-black border-y border-black py-0.5 my-0.5">
              ক্যান্সারের অপারেশনের সার্জিকেল সহ সকল ঔষধ কমিশনে বিক্রয় করা হয়।
            </p>
          )}

          {invoiceType === "somajseba" && (
            <p className="mt-0.5 text-[10px] font-bold leading-tight text-black border-y border-black py-0.5 my-0.5">
              সমাজসেবা ও মানবকল্যাণ সহায়তা মেমো
            </p>
          )}

          {invoiceType === "standard" && (
            <p className="mt-0.5 text-[10px] font-medium leading-tight text-black">
              সার্জিকেল ও সকল প্রকার ঔষধ বিক্রয় করা হয়।
            </p>
          )}

          {invoiceType === "english" && (
            <p className="mt-0.5 text-[10px] font-medium leading-tight text-black">
              Surgical & All Types of Medicines are Sold Here.
            </p>
          )}

          <p className="text-[10px] font-medium leading-tight text-black">
            {invoiceType === "english"
              ? "Zia Medical College Gate, Bogura."
              : "জিয়া মেডিকেল কলেজ গেট, বগুড়া।"}
          </p>

          <p className="mt-0.5 text-[13px] font-bold leading-tight text-black">
            {invoiceType === "english"
              ? "Mobile: 01724-621816"
              : "মোবাইল: ০১৭২৪-৬২১৮১৬"}
          </p>

          <p className="mt-1 text-[11px] font-bold text-black uppercase">
            {invoiceType === "cancer" && "CANCER CARE INVOICE"}
            {invoiceType === "somajseba" && "SOCIAL WELFARE INVOICE"}
            {invoiceType === "standard" && "SALES INVOICE"}
            {invoiceType === "english" && "SALES INVOICE"}
          </p>
        </header>

        <div className="my-1.5 border-t border-dashed border-slate-500" />

        <div className="space-y-0.5 text-[12px] text-black">
          <InfoRow
            label={invoiceType === "english" ? "Invoice No:" : "Invoice:"}
            value={`#${invoice.invoiceNo || ""}`}
          />
          <InfoRow
            label="Date:"
            value={formatDate(invoice.date)}
          />
        </div>

        <div className="my-1.5 border-t border-dashed border-slate-500" />

        <div className="space-y-0.5 text-[12px] text-black">
          <InfoRow
            label={invoiceType === "english" ? "Customer Name:" : "Customer:"}
            value={invoice.customer?.name || "Retail Customer"}
          />
          <InfoRow
            label={invoiceType === "english" ? "Phone No:" : "Phone:"}
            value={invoice.customer?.phone || "-"}
          />
        </div>

        <div className="mt-2">
          <table className="w-full border-collapse border border-black text-black">
            <tbody>
              <tr className="font-bold border-b border-black text-[12px]">
                <td className="border-r border-black px-1 py-1 text-center w-[12%]">SL</td>
                <td className="border-r border-black px-1 py-1 text-left">
                  {invoiceType === "english" ? "Medicine Name" : "Medicine"}
                </td>
                <td className="border-r border-black px-1 py-1 text-center w-[12%]">Qty</td>
                <td className="border-r border-black px-1 py-1 text-center w-[15%]">Rate</td>
                <td className="border-r border-black px-1 py-1 text-center w-[12%]">Dis</td>
                <td className="px-1 py-1 text-center w-[18%]">Amount</td>
              </tr>

              {invoice.medicines?.map((medicine, index) => (
                <tr
                  key={index}
                  className="border-b border-black text-[12px] font-medium"
                >
                  <td className="border-r border-black px-1 py-1 text-center">
                    {index + 1}
                  </td>
                  <td
                    className="border-r border-black px-1 py-1 text-left"
                    style={{ wordBreak: "break-word" }}
                  >
                    {medicine.medicine}
                  </td>
                  <td className="border-r border-black px-1 py-1 text-center">
                    {medicine.qty}
                  </td>
                  <td className="border-r border-black px-1 py-1 text-center">
                    {compactMoney(medicine.rate)}
                  </td>
                  <td className="border-r border-black px-1 py-1 text-center">
                    {Number(medicine.percentageDiscount || 0)}%
                  </td>
                  <td className="px-1 py-1 text-center">
                    {compactMoney(medicine.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-1.5 border-t border-dashed border-slate-500 pt-1 text-black">
          <AmountRow
            label={invoiceType === "english" ? "Sub Total" : "Total"}
            value={invoice.total}
          />
          <AmountRow
            label={
              invoiceType === "somajseba" ? "Discount / Grant" : "Discount"
            }
            value={invoice.discount}
          />

          {isOnlinePayment && (
            <AmountRow
              label="Online Charge (1.2%)"
              value={onlineCharge}
            />
          )}

          <div className="my-1 border-t border-black" />

          <AmountRow
            label={invoiceType === "english" ? "NET PAYABLE" : "PAYABLE"}
            value={finalPayable}
            bold
          />
        </div>

        {/* =========================
            BILL IN WORDS (CENTERED)
        ========================= */}
        <div className="mt-1 border-t border-black pt-1">
          <p className="text-[11px] font-bold text-black capitalize text-center">
            {invoiceType === "english"
              ? `In Words: ${numberToWordsEnglish(finalPayable)}`
              : `কথায়: ${numberToWordsBangla(finalPayable)}`}
          </p>
        </div>

        <div className="mt-3 text-black">
          <p className="text-center text-[12px] font-bold">
            Salesman: {invoice.seller?.name || "-"} | {invoice.seller?.number || "-"}
          </p>

          <div className="my-1.5 border-t border-dashed border-slate-500" />

          {isOnlinePayment && (
            <p className="text-center text-[11px] font-bold uppercase underline mb-1">
              Payment Method: Online Payment
            </p>
          )}

          {invoiceType === "cancer" && (
            <p className="text-center text-[10px] font-bold">
              বিশেষ দ্রষ্টব্য: ক্যান্সারের ঔষধ ও সার্জিকেল পণ্য পরিবর্তনযোগ্য নয়।
            </p>
          )}

          {invoiceType === "somajseba" && (
            <p className="text-center text-[10px] font-bold">
              মানবকল্যাণ ও সামাজিক সহায়তার আওতায় ক্যাশ মেমো প্রদান করা হলো।
            </p>
          )}

          {(invoiceType === "standard" || invoiceType === "english") && (
            <p className="text-center text-[11px] font-bold">
              Thank you for your purchase
            </p>
          )}

          <p className="mt-0.5 text-center text-[11px]">
            Visit our website: sakinpharmacy.online
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================
   COMPONENTS & UTILS
========================= */

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-bold">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

function AmountRow({ label, value, bold = false }) {
  return (
    <div
      className={`flex items-center justify-between py-0.5 ${
        bold ? "text-[14px] font-bold" : "text-[12px] font-bold"
      }`}
    >
      <span>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>
        {money(value)}
      </span>
    </div>
  );
}

function money(value) {
  return Number(value || 0).toFixed(2);
}

function compactMoney(value) {
  const number = Number(value || 0);
  if (Number.isInteger(number)) return number;
  return number.toFixed(2);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

/* =========================
   BANGLA NUMBER TO WORDS
========================= */
function numberToWordsBangla(num) {
  num = Math.round(Number(num || 0));
  if (num === 0) return "শূন্য টাকা মাত্র";

  const units = [
    "", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
    "এগারো", "বারো", "তেরো", "চোদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ", "বিশ",
    "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "২৯", "ত্রিশ",
    "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাইত্রিশ", "আটত্রিশ", "৩৯", "চল্লিশ",
    "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "৪৯", "পঞ্চাশ",
    "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "৫৯", "ষাট",
    "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "৬৯", "সত্তুর",
    "একাতর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "৭৯", "আশি",
    "একাশি", "বিরাশি", "তৈরাশি", "চুরাশি", "পঁচাশী", "ছিয়াশি", "সাতাসি", "অষ্টাসি", "৮৯", "নব্বই",
    "একানব্বই", "বিয়ানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"
  ];

  const exactTens = {
    29: "উনত্রিশ", 39: "উনচল্লিশ", 49: "উনপঞ্চাশ", 59: "উনষাট", 69: "উনসত্তুর", 79: "উনাশি", 89: "উননব্বই"
  };

  const getWord = (n) => exactTens[n] || units[n];

  let result = "";

  if (Math.floor(num / 10000000) > 0) {
    result += getWord(Math.floor(num / 10000000)) + " কোটি ";
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    result += getWord(Math.floor(num / 100000)) + " লাখ ";
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    result += getWord(Math.floor(num / 1000)) + " হাজার ";
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    result += getWord(Math.floor(num / 100)) + " শত ";
    num %= 100;
  }
  if (num > 0) {
    result += getWord(num) + " ";
  }

  return result.trim() + " টাকা মাত্র";
}

/* =========================
   ENGLISH NUMBER TO WORDS
========================= */
function numberToWordsEnglish(num) {
  num = Math.round(Number(num || 0));
  if (num === 0) return "Zero Taka Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + inWords(n % 100) : "");
    if (n < 1000000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
    if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + " Million" + (n % 1000000 !== 0 ? " " + inWords(n % 1000000) : "");
    return "";
  }

  return inWords(num).trim() + " Taka Only";
}