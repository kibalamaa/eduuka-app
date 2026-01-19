"use client";

import { Wallet, AlertCircle, PieChart } from "lucide-react";
import { Sale } from "@/app/types/expenses"; // Ensure you import Sale type

// FIX: Change prop name from 'expenses' to 'sales'
export default function SalesStats({ sales = [] }: { sales: Sale[] }) {
  
  // Calculate Total Verified Revenue
  const totalVerified = sales
    .filter((e) => e.verified)
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate Pending Value
  const totalPendingValue = sales
    .filter((e) => !e.verified)
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate Count of Pending items
  const pendingCount = sales.filter((e) => !e.verified).length;

  // Calculate Top Selling Category
  const categoryTotals: Record<string, number> = {};
  sales.forEach((e) => {
    const cat = e.category || "Uncategorized";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
  });

  const topCategoryEntry = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : "N/A";
  const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

  const formatMoney = (amount: number) =>
    `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} UGX`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Verified Revenue */}
      <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Verified Revenue
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {formatMoney(totalVerified)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Cash confirmed received
        </p>
      </div>

      {/* Pending Approvals */}
      <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-md border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending Approvals
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {pendingCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <p className="mt-4 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
          Potential Value: {formatMoney(totalPendingValue)}
        </p>
      </div>

      {/* Top Category */}
      <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-md border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Top Category
            </p>
            <p
              className="mt-2 text-xl font-bold text-gray-900 dark:text-white truncate max-w-[150px]"
              title={topCategoryName}
            >
              {topCategoryName}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p className="mt-4 text-xs text-purple-600 dark:text-purple-400 font-medium">
          {formatMoney(topCategoryAmount)} sales
        </p>
      </div>
    </div>
  );
}