"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  InvoiceFilter,
  InvoiceTable,
  InvoicePagination,
  InvoiceModal,
} from "@/components/software/invoice/View/ViewInvoiceComponents";

const INVOICES_PER_PAGE = 50;

function getTodayDate() {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export default function ViewInvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [singleDate, setSingleDate] = useState("");
  const [smsFilter, setSmsFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const getUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.log("User Load Error", error);
    } finally {
      setUserLoaded(true);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", currentPage);
      params.set("limit", INVOICES_PER_PAGE);

      if (user?.role === "salesman" && user?.mobile) {
        params.set("sellerNumber", user.mobile);
      }

      if (invoiceSearch?.trim()) {
        params.set("invoiceSearch", invoiceSearch.trim());
      }
      if (customerPhone?.trim()) {
        params.set("customerPhone", customerPhone.trim());
      }
      if (customerName?.trim()) {
        params.set("customerName", customerName.trim());
      }
      if (singleDate) {
        params.set("singleDate", singleDate);
      }
      if (invoiceType) {
        params.set("invoiceType", invoiceType);
      }
      if (smsFilter !== "") {
        params.set("smsFilter", smsFilter);
      }
      if (paidFilter !== "") {
        params.set("paidFilter", paidFilter);
      }

      // Route Path Fixed Here: Added /view
      const res = await fetch(`/api/software/invoices/view?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load invoices");

      setInvoices(data.invoices || []);
      setTotalInvoices(data.pagination?.total || data.invoices?.length || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Invoices Error:", err);
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoaded) {
      getInvoices();
    }
  }, [
    currentPage,
    singleDate,
    invoiceSearch,
    customerPhone,
    customerName,
    invoiceType,
    smsFilter,
    paidFilter,
    userLoaded,
  ]);

  const handleDelete = async (invoice) => {
    const result = await Swal.fire({
      title: "Delete Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/software/invoices/${invoice._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        getInvoices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkPaid = async (invoice) => {
    const result = await Swal.fire({
      title: "Mark as Paid?",
      text: `Do you want to mark Invoice #${invoice.invoiceNo} as Paid?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Paid",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/software/invoices/${invoice._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        Swal.fire("Success!", "Invoice status updated to Paid.", "success");
        getInvoices();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to update invoice status.", "error");
    }
  };

  const today = getTodayDate();
  const isTodayActive = singleDate === today;
  const showingFrom = totalInvoices ? (currentPage - 1) * INVOICES_PER_PAGE + 1 : 0;
  const showingTo = Math.min(currentPage * INVOICES_PER_PAGE, totalInvoices);

  const handleTodayClick = () => {
    setSingleDate(today);
    setInvoiceSearch("");
    setCustomerPhone("");
    setCustomerName("");
    setInvoiceType("");
    setSmsFilter("");
    setPaidFilter("");
    setCurrentPage(1);
  };

  const handleClearClick = () => {
    setSingleDate("");
    setInvoiceSearch("");
    setCustomerPhone("");
    setCustomerName("");
    setInvoiceType("");
    setSmsFilter("");
    setPaidFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h1 className="mb-4 text-center text-xl font-semibold text-sky-700">View Invoice</h1>

      <InvoiceFilter
        invoiceSearch={invoiceSearch}
        setInvoiceSearch={(val) => {
          setInvoiceSearch(val);
          setCurrentPage(1);
        }}
        customerPhone={customerPhone}
        setCustomerPhone={(val) => {
          setCustomerPhone(val);
          setCurrentPage(1);
        }}
        customerName={customerName}
        setCustomerName={(val) => {
          setCustomerName(val);
          setCurrentPage(1);
        }}
        invoiceType={invoiceType}
        setInvoiceType={(val) => {
          setInvoiceType(val);
          setCurrentPage(1);
        }}
        singleDate={singleDate}
        setSingleDate={(val) => {
          setSingleDate(val);
          setCurrentPage(1);
        }}
        smsFilter={smsFilter}
        setSmsFilter={(val) => {
          setSmsFilter(val);
          setCurrentPage(1);
        }}
        paidFilter={paidFilter}
        setPaidFilter={(val) => {
          setPaidFilter(val);
          setCurrentPage(1);
        }}
        onToday={handleTodayClick}
        onClear={handleClearClick}
        isTodayActive={isTodayActive}
      />

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading invoices...</p>
      ) : error ? (
        <p className="py-10 text-center text-rose-500">{error}</p>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onView={(inv) => setSelected(inv)}
          onDelete={handleDelete}
          onMarkPaid={handleMarkPaid}
        />
      )}

      <InvoicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalInvoices={totalInvoices}
        showingFrom={showingFrom}
        showingTo={showingTo}
        setCurrentPage={setCurrentPage}
      />

      {selected && <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}