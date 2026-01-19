"use client";

import { Plus, QrCode } from "lucide-react";

type Props = {
  onOpenModal: () => void;
  onQuickScan: () => void; // <--- THIS LINE WAS MISSING
};

export default function SalesHeader({ onOpenModal, onQuickScan }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sales</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Record transactions and track revenue.
        </p>
      </div>
      
      <div className="flex gap-3">
        {/* Quick Scan Button */}
        <button 
          onClick={onQuickScan}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-lg font-medium transition shadow-lg"
        >
          <QrCode className="w-5 h-5" />
          <span className="hidden sm:inline">Quick Scan</span>
          <span className="sm:hidden">Scan</span>
        </button>

        {/* Manual Record Button */}
        <button 
          onClick={onOpenModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg font-medium transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Record Sale</span>
          <span className="sm:hidden">Record</span>
        </button>
      </div>
    </div>
  );
}