"use client";

import {
  useEffect,
  useState,
} from "react";

import WelcomeCard from "@/components/software/Welcome/welcome";


export default function SoftwareLayout({
  children,
}) {

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 1000); // 1seconds


    return () =>
      clearTimeout(timer);

  }, []);


  if (loading) {

    return (

      <div className="flex justify-center py-10">

        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">

          <span className="loading loading-spinner loading-sm text-[#123B6D]" />

          <div>

            <p className="text-sm font-bold text-[#123B6D]">
              Sakin Pharmacy
            </p>

            <p className="text-[11px] text-slate-400">
              Loading software...
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (
    <WelcomeCard>
      {children}
    </WelcomeCard>
  );

}