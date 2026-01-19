"use client";

import { useState, useEffect } from "react";
import { X, QrCode } from "lucide-react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Sale } from "@/app/types/expenses";
import { InventoryItem } from "@/app/types/inventory";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  editingSale?: Sale | null;
  inventory: InventoryItem[];
  startWithScanner?: boolean;
};

const INPUT_STYLE = "w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all";

export default function RecordSaleModal({ isOpen, onClose, onSubmit, editingSale, inventory, startWithScanner = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const isEditMode = !!editingSale;

  // Form State
  const [selectedItemName, setSelectedItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [category, setCategory] = useState("Retail");

  // Reset or Initialize Form
  useEffect(() => {
    if (isOpen) {
      if (editingSale) {
        setSelectedItemName(editingSale.item);
        setQuantity(editingSale.quantity);
        setTotalAmount(editingSale.amount);
        setCategory(editingSale.category);
        setUnitPrice(editingSale.quantity > 0 ? editingSale.amount / editingSale.quantity : 0);
        setShowScanner(false);
      } else {
        setSelectedItemName("");
        setQuantity(1);
        setUnitPrice(0);
        setTotalAmount(0);
        setCategory("Retail");
        // Open scanner immediately if requested
        setShowScanner(startWithScanner);
      }
    } else {
        // Ensure scanner is off when modal closes
        setShowScanner(false);
    }
  }, [isOpen, editingSale, startWithScanner]);

  // Logic to handle item selection (Dropdown or Scan)
  const selectItem = (itemName: string) => {
    if (!itemName) return;

    // Case insensitive search
    const stockItem = inventory.find(i => i.item.toLowerCase() === itemName.toLowerCase());
    
    if (stockItem) {
      setSelectedItemName(stockItem.item); // Use exact name from DB
      setUnitPrice(stockItem.price);
      setCategory(stockItem.category);
      setTotalAmount(stockItem.price * quantity);
      setShowScanner(false); // Close camera on success
      
      // Optional: Play a beep sound here or use the library's built-in audio
    } else {
      alert(`Item "${itemName}" not found in inventory.`);
      setShowScanner(false);
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectItem(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value) || 0;
    setQuantity(qty);
    setTotalAmount(qty * unitPrice);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      item: selectedItemName,
      quantity: quantity,
      amount: totalAmount,
      category: category,
      description: (e.currentTarget.elements.namedItem('description') as HTMLInputElement).value,
    };

    await onSubmit(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  const currentStock = inventory.find(i => i.item === selectedItemName)?.quantity;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {isEditMode ? "Edit Sale" : "Record New Sale"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          
          {/* SCANNER UI */}
          {!isEditMode && (
            <div className="mb-4">
               {!showScanner ? (
                 <button 
                   type="button"
                   onClick={() => setShowScanner(true)}
                   className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition border border-dashed border-slate-300 dark:border-slate-600"
                 >
                   <QrCode className="w-5 h-5" />
                   Activate Camera
                 </button>
               ) : (
                 <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                   {/* NEW SCANNER COMPONENT */}
                   <Scanner 
                        onScan={(result) => {
                            if (result && result.length > 0) {
                                selectItem(result[0].rawValue);
                            }
                        }}
                        onError={(error) => console.log(error)}
                        components={{
                            audio: true, // Plays beep on scan
                            torch: true, // Adds flash button
                            finder: true // Adds the visual scanning box
                        }}
                        styles={{
                            container: { width: "100%", height: "100%" }
                        }}
                   />
                   <button 
                     onClick={() => setShowScanner(false)}
                     className="absolute top-2 right-2 bg-red-600/90 text-white px-3 py-1 text-xs rounded-full shadow-sm z-10"
                   >
                     Cancel Scan
                   </button>
                 </div>
               )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Select Item
                {currentStock !== undefined && (
                  <span className={`ml-2 text-xs ${currentStock < 1 ? 'text-red-500' : 'text-green-600'}`}>
                    (In Stock: {currentStock})
                  </span>
                )}
              </label>
              {isEditMode ? (
                 <input type="text" value={selectedItemName} readOnly className={`${INPUT_STYLE} bg-gray-100 cursor-not-allowed`} />
              ) : (
                <select required name="item" value={selectedItemName} onChange={handleItemChange} className={INPUT_STYLE}>
                  <option value="">-- Choose Item or Scan --</option>
                  {inventory.map((stock) => (
                    <option key={stock.id} value={stock.item} disabled={stock.quantity <= 0}>
                      {stock.item} {stock.quantity <= 0 ? '(Out of Stock)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Quantity & Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantity</label>
                <input 
                  required 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  max={!isEditMode && currentStock ? currentStock : undefined} 
                  value={quantity} 
                  onChange={handleQuantityChange} 
                  className={INPUT_STYLE} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Amount</label>
                <input 
                  required 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  value={totalAmount} 
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value))} 
                  className={INPUT_STYLE} 
                />
              </div>
            </div>

            {/* Read-Only Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <input name="category" type="text" readOnly value={category} className={`${INPUT_STYLE} bg-gray-100 dark:bg-slate-700 cursor-default`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (Optional)</label>
              <input name="description" type="text" placeholder="e.g. Paid via Cash" defaultValue={editingSale?.description || ''} className={INPUT_STYLE} />
            </div>

            <div className="pt-2 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200">Cancel</button>
              <button type="submit" disabled={loading || (!isEditMode && (!selectedItemName || (currentStock !== undefined && currentStock < quantity)))} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Saving..." : (isEditMode ? "Update" : "Record Sale")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}