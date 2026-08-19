import React from "react";
import { FaClock } from "react-icons/fa";

const DashBoard = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FaClock className="text-xl" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Dashboard Coming Soon
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          We&apos;re working on something useful for your pharmacy dashboard.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
          <span className="loading loading-dots loading-xs" />
          Under Development
        </div>
      </div>
    </div>
  );
};

export default DashBoard;