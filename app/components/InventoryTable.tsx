"use client";

import { Search, FileText, Trash2, Edit, AlertCircle, Lock, QrCode } from "lucide-react"; 
import { InventoryItem } from "@/app/types/inventory";

type Props = {
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onPrintLabel: (item: InventoryItem) => void; // 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: string;
};

export default function InventoryTable({
  inventory, onDelete, onEdit, onPrintLabel, searchTerm, setSearchTerm, userRole,
}: Props) {
  
  // Normalize role
  const isAdmin = userRole?.toLowerCase() === "admin";

  const filtered = inventory.filter(e => {
    const term = searchTerm.toLowerCase();
    const itemMatch = (e.item || "").toLowerCase().includes(term);
    const catMatch = (e.category || "").toLowerCase().includes(term);
    return itemMatch || catMatch;
  });

  return (
    <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Stock List
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item name or category..." 
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
              <th className="p-6">Item Name</th>
              <th className="p-6">Description</th>
              <th className="p-6">Category</th>
              <th className="p-6">Unit Price</th>
              <th className="p-6">Units</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-6 font-medium text-gray-900 dark:text-white">{item.item}</td>
                <td className="p-6 text-sm text-gray-500">{item.description || "-"}</td>
                <td className="p-6">{item.category}</td>
                <td className="p-6 font-bold text-gray-900 dark:text-white">${item.price.toLocaleString()}</td>
                <td className="p-6">
                   <div className={`flex items-center gap-2 font-bold ${item.quantity < 5 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {item.quantity}
                    {item.quantity < 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
                   </div>
                </td>

                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    
                    {/* QR BUTTON: Visible to everyone */}
                    <button 
                        onClick={() => onPrintLabel(item)} 
                        className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors" 
                        title="Print QR Label"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>

                    {/* ADMIN ONLY BUTTONS */}
                    {isAdmin ? (
                      <>
                        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Edit Stock">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete Stock">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="p-2 text-gray-300 dark:text-slate-600 cursor-not-allowed" title="Admin Access Required">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="p-16 text-center text-gray-500">No stock items found.</div>
        )}
      </div>
    </div>
  );
}