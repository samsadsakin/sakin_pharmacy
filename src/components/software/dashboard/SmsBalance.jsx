"use client";

import { useEffect, useState } from "react";
import { FaSms } from "react-icons/fa";

import DashboardStat from "./DashboardStat";

export default function SmsBalance() {
  const [balance, setBalance] = useState(null);
  const [expiry, setExpiry] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const getSmsInfo = async () => {

      try {

        const response = await fetch(
          "/api/software/sms/sms-balance",
          {
            cache: "no-store",
          }
        );


        const data = await response.json();


        if (data.success) {

          setBalance(data.balance);

          setExpiry(data.expiry);

        } else {

          console.error(
            "SMS API Error:",
            data.message
          );

        }

      } catch (error) {

        console.error(
          "SMS Information Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    getSmsInfo();

  }, []);


  // =========================
  // BDT FORMAT
  // =========================

  const formatBDT = (amount) => {

    if (
      amount === null ||
      amount === undefined
    ) {
      return "পাওয়া যায়নি";
    }


    return `৳ ${Number(amount).toLocaleString(
      "bn-BD",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  };


  return (

    <DashboardStat

      title="SMS Balance"

      value={
        loading
          ? "..."
          : formatBDT(balance)
      }

      description={
        loading
          ? "তথ্য লোড হচ্ছে..."
          : expiry
          ? `মেয়াদ: ${expiry}`
          : "মেয়াদ পাওয়া যায়নি"
      }

      icon={<FaSms />}

      variant="sky"

    />

  );

}