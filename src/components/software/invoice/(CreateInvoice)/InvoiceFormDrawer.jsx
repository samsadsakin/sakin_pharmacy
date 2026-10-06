"use client";

import { useEffect, useRef, useState } from "react";

// ================= UTILS & DEFAULTS =================
export const emptyCustomer = { name: "", moreInfo: "", phone: "" };
export const emptyMedicine = { medicineId: "", medicine: "", qty: "", rate: "", dis: "", oldPrice: null };
export const defaultOptions = { sms: false, smsType: "short", print: true, paid: true };

export const money = (value) => Number(value || 0).toFixed(2);
export const getAmount = (row) => {
  const qty = Number(row.qty || 0);
  const rate = Number(row.rate || 0);
  const dis = Number(row.dis || 0);
  return qty * rate * (1 - dis / 100);
};

// ================= MEDICINE SEARCH INPUT =================
function MedicineSearchInput({ value, onChange, onSelect }) {
  const [search, setSearch] = useState(value || "");
  const [results, setResults] = useState([]);
  const skipSearch = useRef(false);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }

    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/software/medicines/search?q=${encodeURIComponent(search)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success) {
          setResults(data.medicines || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.log("Medicine Search Error:", error);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  function selectMedicine(item) {
    skipSearch.current = true;
    setSearch(item.name);
    setResults([]);
    onSelect({
      id: item._id,
      name: item.name,
      price: item.salePrice,
    });
  }

  return (
    <div className="relative w-full">
      <input
        value={search}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearch(newValue);
          onChange(newValue);
        }}
        placeholder="Medicine Name"
        autoComplete="off"
        className="h-10 w-full rounded-xl border border-sky-200 bg-white/90 px-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
      />

      {/* FLOATING DROPDOWN MENU */}
      {results.length > 0 && (
        <div className="absolute left-0 top-full z-[9999] mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-sky-100 bg-white p-1.5 shadow-lg">
          {results.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => selectMedicine(item)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-sky-50"
            >
              <span className="text-slate-700 font-medium">{item.name}</span>
              <span className="shrink-0 font-bold text-emerald-600">
                ৳ {item.salePrice}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= FORM DRAWER / PANEL =================
export default function InvoiceFormDrawer({
  customer,
  setCustomer,
  item,
  setItem,
  addMedicine,
  total,
  discount,
  payable,
  setPayable,
  options,
  setOptions,
  saveInvoice,
  disabledSave,
}) {
  const autoFilledName = useRef("");
  // সেভ চলাকালীন একাধিক ক্লিক রোধ করার স্টেট
  const [isSaving, setIsSaving] = useState(false);

  // Customer Mobile Lookup
  useEffect(() => {
    const mobile = String(customer.phone || "")
      .replace(/\D/g, "")
      .trim();

    if (mobile.length !== 11) {
      if (
        autoFilledName.current &&
        customer.name === autoFilledName.current
      ) {
        setCustomer((prev) => ({
          ...prev,
          name: "",
        }));
        autoFilledName.current = "";
      }
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/software/users/by-mobile?mobile=${encodeURIComponent(mobile)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data.success && data.user) {
          autoFilledName.current = data.user.name || "";
          setCustomer((prev) => ({
            ...prev,
            name: data.user.name || "",
          }));
          return;
        }

        if (
          autoFilledName.current &&
          customer.name === autoFilledName.current
        ) {
          setCustomer((prev) => ({
            ...prev,
            name: "",
          }));
          autoFilledName.current = "";
        }
      } catch (error) {
        console.log("Customer Search Error:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customer.phone, setCustomer]);

  const updateOption = (field, value) => {
    setOptions({
      ...options,
      [field]: value,
    });
  };

  const updateItem = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineSelect = (data) => {
    setItem((prev) => ({
      ...prev,
      medicineId: data.id,
      medicine: data.name,
      rate: data.price,
      oldPrice: data.price,
    }));
  };

  // =========================================================
  // SEND MEDICINE UPDATE TO PENDING LIST VIA SAME API
  // =========================================================
  const sendToPendingUpdates = async (medicineItem) => {
    if (!medicineItem.medicine || Number(medicineItem.rate) <= 0) return;

    let payload = null;

    if (medicineItem.medicineId) {
      if (Number(medicineItem.rate) !== Number(medicineItem.oldPrice)) {
        payload = {
          type: "price_update",
          medicineId: medicineItem.medicineId,
          medicineName: medicineItem.medicine,
          oldPrice: medicineItem.oldPrice,
          newPrice: Number(medicineItem.rate),
        };
      }
    } else {
      payload = {
        type: "new_medicine",
        medicineName: medicineItem.medicine.trim(),
        oldPrice: null,
        newPrice: Number(medicineItem.rate),
      };
    }

    if (!payload) return;

    try {
      await fetch("/api/software/medicine-updates/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.log("Add Pending Error:", err);
    }
  };

  const handleAddMedicine = () => {
    if (!item.medicine || Number(item.qty) <= 0 || Number(item.rate) <= 0) return;

    sendToPendingUpdates(item);
    addMedicine();
  };

  // সেভ বাটন ক্লিক হ্যান্ডলার
  const handleSaveInvoice = async () => {
    if (isSaving || disabledSave) return;

    setIsSaving(true);
    try {
      await saveInvoice();
    } catch (error) {
      console.log("Save Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. CUSTOMER SECTION */}
      <div className="rounded-2xl bg-white/80 p-4 border border-sky-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold tracking-wider uppercase text-sky-800">
          Customer Details
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <input
              type="text"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium outline-none transition hover:border-sky-300 focus:bg-white focus:border-sky-500"
            />
          </label>
          <label className="block">
            <input
              type="text"
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) => {
                autoFilledName.current = "";
                setCustomer({ ...customer, name: e.target.value });
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium outline-none transition hover:border-sky-300 focus:bg-white focus:border-sky-500"
            />
          </label>
          <label className="block">
            <input
              type="text"
              placeholder="More Info"
              value={customer.moreInfo}
              onChange={(e) => setCustomer({ ...customer, moreInfo: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium outline-none transition hover:border-sky-300 focus:bg-white focus:border-sky-500"
            />
          </label>
        </div>
      </div>

      {/* 2. ADD MEDICINE & CALCULATION BOX */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ADD MEDICINE */}
        <div className="rounded-2xl bg-sky-50/60 p-4 border border-sky-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-700">
              Add Medicine Item
            </h3>
          </div>

          <div className="space-y-3">
            {/* MEDICINE SEARCH INPUT */}
            <div className="w-full">
              <MedicineSearchInput
                value={item.medicine}
                onChange={(value) => {
                  setItem((prev) => ({
                    ...prev,
                    medicine: value,
                    medicineId: "",
                    oldPrice: null,
                  }));
                }}
                onSelect={handleMedicineSelect}
              />
            </div>

            {/* QTY, RATE, DISCOUNT */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <input
                type="number"
                name="qty"
                placeholder="Qty"
                value={item.qty}
                onChange={updateItem}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-sky-500"
              />
              <input
                type="number"
                name="rate"
                placeholder="Rate"
                value={item.rate}
                onChange={updateItem}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-sky-500"
              />
              <input
                type="number"
                name="dis"
                placeholder="Dis %"
                value={item.dis}
                onChange={updateItem}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddMedicine}
            className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 active:scale-[0.99] transition-all"
          >
            + Add Medicine
          </button>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="rounded-2xl bg-white/80 p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            <h3 className="text-xs font-bold tracking-wider uppercase text-sky-800">
              Calculation
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 font-medium">Total</span>
              <input
                type="text"
                value={money(total)}
                readOnly
                className="w-32 cursor-not-allowed rounded-xl bg-slate-100 px-3 py-1.5 text-right font-semibold text-slate-600 outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 font-medium">Discount</span>
              <input
                type="text"
                value={money(discount)}
                readOnly
                className="w-32 cursor-not-allowed rounded-xl bg-slate-100 px-3 py-1.5 text-right font-semibold text-slate-600 outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800">Payable Amount</span>
              <input
                type="number"
                min="0"
                max={total}
                value={payable}
                placeholder={money(total)}
                onChange={(e) => setPayable(e.target.value)}
                className="w-32 rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-right font-extrabold text-sky-800 outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. OPTIONS & SAVE BUTTON */}
      <div className="grid gap-4 md:grid-cols-12 items-center">
        {/* OPTIONS */}
        <div className="md:col-span-7 rounded-2xl bg-sky-50/70 p-3.5 border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Invoice Options:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 font-medium">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={options.sms}
                onChange={(e) => updateOption("sms", e.target.checked)}
                className="h-4 w-4 accent-sky-700"
              />
              SMS
            </label>

            {options.sms && (
              <div className="flex rounded-lg bg-white p-0.5 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => updateOption("smsType", "short")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    options.smsType === "short"
                      ? "bg-sky-700 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Short
                </button>
                <button
                  type="button"
                  onClick={() => updateOption("smsType", "long")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    options.smsType === "long"
                      ? "bg-sky-700 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Long
                </button>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={options.print}
                onChange={(e) => updateOption("print", e.target.checked)}
                className="h-4 w-4 accent-sky-700"
              />
              Print
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={options.paid}
                onChange={(e) => updateOption("paid", e.target.checked)}
                className="h-4 w-4 accent-sky-700"
              />
              Paid
            </label>
          </div>
        </div>

        {/* CLEAN NO-OUTER-SHADOW SAVE INVOICE BUTTON */}
        <div className="md:col-span-5">
          <button
            type="button"
            onClick={handleSaveInvoice}
            disabled={disabledSave || isSaving}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-gradient-to-r hover:from-sky-700 hover:via-indigo-700 hover:to-blue-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {/* ICON BADGE OR LOADING SPINNER */}
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
              {isSaving ? (
                <svg
                  className="h-3.5 w-3.5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            {/* BUTTON TEXT */}
            <span className="tracking-wider uppercase text-xs font-extrabold text-white">
              {isSaving ? "Saving..." : "Save Invoice"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}