"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { InventoryItem } from "@/app/types/inventory";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  editingItem?: InventoryItem | null;
};

const INPUT_STYLE = "w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all";

export default function AddStockModal({ isOpen, onClose, onSubmit, editingItem }: Props) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editingItem;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      item: formData.get('item'),
      description: formData.get('description'),
      price: formData.get('price'),      // Fixed name
      quantity: formData.get('quantity'), // Fixed name
      category: formData.get('category')
    };

    await onSubmit(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {isEditMode ? "Edit Stock Details" : "Add New Stock"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Stock Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Item Name</label>
            <input 
              required 
              name="item" 
              type="text" 
              placeholder="e.g. LED TV 32 Inch"
              defaultValue={editingItem?.item || ''}
              className={INPUT_STYLE} 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
             <select 
              required 
              name="category" 
              defaultValue={editingItem?.category || 'General'}
              className={INPUT_STYLE}
            >
              <option value="General">General</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food & Beverage</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>

          {/* Price & Units */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit Price</label>
              <input 
                required 
                name="price" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                defaultValue={editingItem?.price || ''}
                className={INPUT_STYLE} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Units</label>
              <input 
                required 
                name="quantity" 
                type="number" 
                placeholder="0" 
                defaultValue={editingItem?.quantity || ''}
                className={INPUT_STYLE} 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (Optional)</label>
            <input 
              name="description" 
              type="text" 
              placeholder="e.g. Black, Model X"
              defaultValue={editingItem?.description || ''}
              className={INPUT_STYLE} 
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
              {loading ? "Saving..." : (isEditMode ? "Update Stock" : "Add to Inventory")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}