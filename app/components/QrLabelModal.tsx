"use client";

import { useRef } from "react";
import { X, Printer } from "lucide-react";
import QRCode from "react-qr-code";
import { InventoryItem } from "@/app/types/inventory";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
};

export default function QrLabelModal({ isOpen, onClose, item }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    // 1. Open a new window for printing
    const printWindow = window.open('', '', 'width=600,height=600');
    
    if (printWindow && printRef.current) {
      // 2. Write the HTML content to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Label - ${item.item}</title>
            <style>
              body { 
                font-family: sans-serif; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh;
                margin: 0;
              }
              .label-container {
                border: 2px dashed #000;
                padding: 20px;
                width: 300px; /* Standard sticker width */
                text-align: center;
              }
              h1 { font-size: 24px; margin: 10px 0 5px 0; text-transform: uppercase; }
              p { font-size: 28px; margin: 5px 0; font-weight: bold; }
              .meta { font-size: 12px; color: #555; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="label-container">
              ${printRef.current.innerHTML}
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Print Product Label</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (This is what gets copied to the print window) */}
        <div className="p-8 flex flex-col items-center justify-center bg-white rounded-b-lg">
          <div ref={printRef} className="flex flex-col items-center w-full">
            
            {/* The QR Code Value is the Item Name */}
            <div style={{ background: 'white', padding: '0px', height: "auto", maxWidth: 200, width: "100%" }}>
                <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={item.item} // <--- CRITICAL: This text matches what the scanner reads
                viewBox={`0 0 256 256`}
                />
            </div>
            
            <h1 className="mt-4 text-xl font-extrabold text-black uppercase">{item.item}</h1>
            <p className="text-2xl font-bold text-black">${item.price.toLocaleString()}</p>
            <div className="text-xs text-gray-500 mt-2">{item.category}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-b-lg flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            Cancel
          </button>
          <button onClick={handlePrint} className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Printer className="w-4 h-4" />
            Print Sticker
          </button>
        </div>

      </div>
    </div>
  );
}