"use client";

import { Search, FileText, CheckCircle2, AlertCircle, Trash2, Lock, Edit } from "lucide-react";
import { Sale } from "../../types/expenses";

type Props = {
  sales: Sale[];
  onToggleVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (sale: Sale) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: string;
};

export default function SalesTable({
  sales, onToggleVerify, onDelete, onEdit, searchTerm, setSearchTerm, userRole,
}: Props) {
  
  const role = userRole?.toLowerCase() || "staff";
  const isAdmin = role === "admin";
  const isFinance = role === "finance";
  // Staff can only edit if not verified
  const canEdit = (verified: boolean) => isAdmin || (!verified && !isFinance);

  // ... Filter logic remains same ...
  const filteredSales = sales.filter(item => {
    const term = searchTerm.toLowerCase();
    return (item.item || "").toLowerCase().includes(term) || 
           (item.category || "").toLowerCase().includes(term);
  });

  return (
    <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Sales History
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />
        </div>
      </div>

<div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
            <tr>
              <th className="p-6">Date</th>
              <th className="p-6">Item</th>
              <th className="p-6">Category</th>
              <th className="p-6">Qty</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredSales.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                {/* ... Data Columns remain same ... */}
                <td className="p-6 text-sm text-gray-600 dark:text-gray-300">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-6 font-medium text-gray-900 dark:text-white">{item.item}</td>
                <td className="p-6 text-sm">{item.category}</td>
                <td className="p-6 text-sm font-bold">{item.quantity}</td>
                <td className="p-6 font-bold">{item.amount.toLocaleString()} UGX</td>
                <td className="p-6">
                  {item.verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    
                    {/* EDIT: Admin or (Staff if unverified) */}
                    {canEdit(item.verified) && (
                      <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit Sale">
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    
                    {/* VERIFY: Admin or Finance */}
                    {(isAdmin || isFinance) ? (
                      <button 
                        onClick={() => onToggleVerify(item.id)} 
                        className={`p-2 rounded-lg transition-colors ${item.verified ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:text-green-600 hover:bg-green-50"}`}
                        title={item.verified ? "Unverify" : "Verify"}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    ) : null}

                    {/* DELETE: Strictly Admin */}
                    {isAdmin ? (
                       <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                         <Trash2 className="w-5 h-5" />
                       </button>
                    ) : (
                      <div className="p-2 text-gray-300 cursor-not-allowed" title="Protected">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}