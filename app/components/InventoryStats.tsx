import { DollarSign, Users, TrendingDown, CheckCircle, AlertTriangle, Building2 } from "lucide-react";
import { InventoryItem } from "../../types/inventory";

export default function InventoryStats({ inventory }: { inventory: InventoryItem[] }) {
  
  // 1. Total Value of Stock (Price * Quantity)
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 2. Count Unique Items
  const uniqueItems = inventory.length;

  // 3. Low Stock (e.g. less than 5 units)
  const lowStockCount = inventory.filter(i => i.quantity < 5).length;

  // 4. Healthy Stock
  const healthyStockCount = inventory.filter(i => i.quantity >= 5).length;

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Total Asset Value */}
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 shadow-lg border border-gray-100 dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-indigo-600/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Stock Value</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{formatMoney(totalValue)}</p>
          <p className="text-xs text-indigo-600 font-medium">Assets on hand</p>
        </div>
      </div>

      {/* Available Products */}
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 shadow-lg border border-gray-100 dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Unique Items</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{uniqueItems}</p>
          <p className="text-xs text-blue-600 font-medium">Distinct products listed</p>
        </div>
      </div>

      {/* Low Stock Warning */}
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 shadow-lg border border-gray-100 dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-rose-600/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            {lowStockCount > 0 && <AlertTriangle className="h-5 w-5 text-rose-600" />}
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{lowStockCount}</p>
          <p className="text-xs text-rose-600 font-medium">Items below 5 units</p>
        </div>
      </div>

      {/* Healthy Stock */}
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 shadow-lg border border-gray-100 dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Healthy Stock</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{healthyStockCount}</p>
          <p className="text-xs text-amber-600 font-medium">Fully stocked items</p>
        </div>
      </div>

    </div>
  );
}