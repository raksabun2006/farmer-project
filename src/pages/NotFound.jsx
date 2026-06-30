import React from 'react';
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center select-none font-siemreap">
      {/* Ultra-minimal status */}
      <h1 className="text-7xl font-light text-slate-300 font-mono tracking-wider">
        404
      </h1>

      {/* Clean, simple typography */}
      <div className="mt-4 space-y-1">
        <h2 className="text-lg font-bold text-slate-800">
          រកមិនឃើញទំព័រនេះទេ
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-mono">
          Page not found
        </p>
      </div>


      <div className="mt-8 flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          ត្រឡប់ក្រោយ (Go Back)
        </button>
        <span className="text-slate-200">|</span>
        <button
          onClick={() => navigate("/")}
          className="text-emerald-600 hover:text-emerald-700 font-bold transition cursor-pointer"
        >
          ទៅទំព័រដើម (Go Home)
        </button>
      </div>
    </div>
  );
};

export default NotFound;