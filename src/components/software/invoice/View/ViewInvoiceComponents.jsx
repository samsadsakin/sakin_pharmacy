"use client";

import Link from "next/link";

export function money(value) {
  return Number(value || 0).toFixed(2);
}

export function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-CA");
}

export function InvoiceFilter({
  invoiceSearch,
  setInvoiceSearch,
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
  invoiceType,
  setInvoiceType,
  singleDate,
  setSingleDate,
  smsFilter,
  setSmsFilter,
  paidFilter,
  setPaidFilter,
  onToday,
  onClear,
  isTodayActive,
}) {
  return (
    <div className="mb-5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <div>
          <input
            type="text"
            placeholder="Invoice No..."
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Customer Phone..."
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Customer Name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          >
            <option value="">Type: All</option>
            <option value="regular">Regular</option>
            <option value="kemo">Kemo</option>
            <option value="somajseba">Somajseba</option>
          </select>
        </div>

        {/* Shudhu Single Date Filter */}
        <div>
          <input
            type="date"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={smsFilter}
            onChange={(e) => setSmsFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          >
            <option value="">SMS: All</option>
            <option value="true">SMS: True</option>
            <option value="false">SMS: False</option>
          </select>
        </div>
        <div>
          <select
            value={paidFilter}
            onChange={(e) => setPaidFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          >
            <option value="">Paid: All</option>
            <option value="true">Paid: True</option>
            <option value="false">Paid: False</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToday}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              isTodayActive ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export function InvoiceTable({ invoices, onView, onDelete, onMarkPaid }) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-sky-50 text-slate-700">
            <tr>
              <th className="hidden px-2 py-3 text-center text-xs font-semibold sm:px-4 md:table-cell">
                Invoice Date
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold sm:px-4">Inv No</th>
              <th className="px-2 py-3 text-center text-xs font-semibold sm:px-4">Seller</th>
              <th className="px-2 py-3 text-center text-xs font-semibold sm:px-4">Paid Amt</th>
              <th className="hidden px-2 py-3 text-center text-xs font-semibold sm:px-4 md:table-cell">
                Medicine
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold sm:px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-14 text-center text-slate-400">
                  No invoice found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => {
                const isPaid = invoice.options?.paid === true || String(invoice.options?.paid) === "true";

                return (
                  <tr key={invoice._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="hidden whitespace-nowrap px-2 py-3 text-center text-xs text-slate-600 sm:px-4 sm:text-sm md:table-cell">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-center text-xs font-semibold text-sky-700 sm:px-4 sm:text-sm">
                      {invoice.invoiceNo}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-center text-xs font-medium text-emerald-700 sm:px-4 sm:text-sm">
                      {invoice.seller?.name || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-center text-xs text-slate-600 sm:px-4 sm:text-sm">
                      {money(invoice.payableAmount)}
                    </td>
                    <td className="hidden whitespace-nowrap px-2 py-3 text-center text-xs text-slate-600 sm:px-4 sm:text-sm md:table-cell">
                      {invoice.medicines?.length || 0}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-center text-xs text-slate-600 sm:px-4 sm:text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onView(invoice)}
                          className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
                        >
                          View
                        </button>

                        {/* Paid true hole button hide hobe, false hole dekhabe */}
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => onMarkPaid(invoice)}
                            className="hidden rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 md:block"
                          >
                            Paid
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(invoice)}
                          className="hidden rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 md:block"
                        >
                          Delete
                        </button>

                        <Link
                          href={`/software/Invoice/PrintInvoice/${invoice._id}`}
                          className="hidden rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 md:block"
                        >
                          Print
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InvoicePagination({
  currentPage,
  totalPages,
  totalInvoices,
  showingFrom,
  showingTo,
  setCurrentPage,
}) {
  if (totalInvoices <= 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{showingFrom}</span> -{" "}
        <span className="font-semibold text-slate-700">{showingTo}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalInvoices}</span> invoices
      </p>
      <div className="join">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="join-item btn btn-sm"
        >
          Previous
        </button>
        <button type="button" className="join-item btn btn-sm pointer-events-none">
          Page {currentPage} of {totalPages}
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage >= totalPages}
          className="join-item btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function InvoiceModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div>
            <h2 className="font-semibold text-sky-700">Invoice #{invoice.invoiceNo}</h2>
            <p className="text-xs text-slate-400">{formatDate(invoice.date)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <span className="font-semibold">Seller:</span> {invoice.seller?.name || "N/A"}
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">
            <span className="font-semibold">Type:</span> {invoice.invoiceType || "regular"}
          </div>
        </div>

        {invoice.options && (
          <div className="mx-4 mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-3 text-xs text-slate-700 sm:grid-cols-4">
            <div>
              <span className="font-semibold">SMS:</span> {String(invoice.options.sms)}
            </div>
            <div>
              <span className="font-semibold">SMS Type:</span> {invoice.options.smsType || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Paid:</span> {String(invoice.options.paid)}
            </div>
            <div>
              <span className="font-semibold">Print:</span> {String(invoice.options.print)}
            </div>
          </div>
        )}

        <div className="mx-4 mt-3 space-y-2">
          <div className="flex gap-2">
            <span className="w-20 text-xs font-semibold text-slate-600">Name</span>
            <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">
              {invoice.customer?.name || "N/A"}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="w-20 text-xs font-semibold text-slate-600">Phone</span>
            <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">
              {invoice.customer?.phone || "N/A"}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="w-20 text-xs font-semibold text-slate-600">More Info</span>
            <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">
              {invoice.customer?.moreInfo || "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto px-4">
          <table className="w-full min-w-96 text-sm">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-3 py-2 text-left">Medicine</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Rate</th>
                <th className="px-3 py-2">Dis %</th>
                <th className="px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.medicines?.map((med, index) => (
                <tr key={index} className="border-b">
                  <td className="px-3 py-2">{med.medicine}</td>
                  <td className="text-center">{med.qty}</td>
                  <td className="text-center">{money(med.rate)}</td>
                  <td className="text-center">{med.percentageDiscount || 0}%</td>
                  <td className="text-center font-semibold text-sky-700">{money(med.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mx-4 my-4 rounded-xl bg-slate-50 p-4">
          <div className="flex justify-between py-1 text-slate-500">
            <span>Total</span>
            <span className="text-slate-700">{money(invoice.total)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-500">
            <span>Discount</span>
            <span className="text-slate-700">{money(invoice.discount)}</span>
          </div>
          <div className="flex justify-between py-1 font-semibold text-slate-700">
            <span>Payable</span>
            <span className="text-sky-700">{money(invoice.payableAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}