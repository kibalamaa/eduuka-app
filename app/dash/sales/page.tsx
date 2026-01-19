"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sale, AlertState } from "../../types/expenses";
import { InventoryItem } from "../../types/inventory";

import SalesHeader from "@/app/components/SalesHeader";
import SalesStats from "@/app/components/SalesStats";
import SalesTable from "@/app/components/SalesTable";
import RecordSaleModal from "@/app/components/RecordSaleModal";
import AlertDialog from "@/app/components/AlertDialog";

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startWithScanner, setStartWithScanner] = useState(false); // <--- New State
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const [alertConfig, setAlertConfig] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // @ts-ignore
  const userRole = session?.user?.role || "staff";

  // Fetch Logic (Stays the same)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, inventoryRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/inventory")
      ]);

      if (!salesRes.ok || !inventoryRes.ok) throw new Error("Failed to fetch data");
      
      const salesData = await salesRes.json();
      const inventoryData = await inventoryRes.json();
      
      const formattedSales = salesData.map((item: any) => ({ ...item, id: item._id }));
      const formattedInventory = inventoryData.map((item: any) => ({ ...item, id: item._id }));

      setSales(formattedSales);
      setInventoryList(formattedInventory);

    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to load data.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  const showAlert = (title: string, message: string, type: AlertState["type"] = "info", onConfirm?: () => void) => {
    setAlertConfig({ isOpen: true, title, message, type, onConfirm });
  };

  // Create/Update Logic (Stays the same)
  const handleCreate = async (data: any) => {
    try {
      const payload = {
        item: data.item,
        quantity: parseInt(data.quantity),
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description,
      };

      if (editingSale) {
        const res = await fetch(`/api/sales/${editingSale.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        showAlert("Success", "Sale updated successfully.", "success");
      } else {
        const res = await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        const responseData = await res.json();
        
        if (!res.ok) {
           throw new Error(responseData.message || "Creation failed");
        }
        showAlert("Success", "Sale recorded and stock updated.", "success");
      }
      
      setIsModalOpen(false);
      setEditingSale(null);
      setStartWithScanner(false); // Reset scanner state
      fetchData(); 
    } catch (err: any) {
      showAlert("Failed", err.message, "warning");
    }
  };

  // Handlers for Opening Modal
  const handleOpenManual = () => {
    setStartWithScanner(false);
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleOpenScanner = () => {
    setStartWithScanner(true);
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setStartWithScanner(false);
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    setStartWithScanner(false);
  };

  // Verification & Deletion Logic (Stays the same)
  const handleToggleVerify = async (id: string) => {
    const sale = sales.find((e) => e.id === id);
    if (!sale) return;
    setSales((prev) => prev.map((e) => (e.id === id ? { ...e, verified: !e.verified } : e)));
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !sale.verified }),
      });
      if (!res.ok) throw new Error("Permission Denied");
    } catch (err: any) {
      fetchData(); 
      showAlert("Permission Denied", "Only Finance/Admin can verify.", "danger");
    }
  };

  const handleDeleteClick = (id: string) => {
    showAlert("Delete Transaction?", "Deleting a sale does NOT restore stock.", "danger", () => performDelete(id));
  };

  const performDelete = async (id: string) => {
    closeAlert();
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSales((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      fetchData(); 
      showAlert("Error", err.message, "warning");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sales data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 md:p-8">
      <SalesHeader 
        onOpenModal={handleOpenManual} 
        onQuickScan={handleOpenScanner} // <--- Pass the new handler
      />
      
      <SalesStats sales={sales} />
      
      <SalesTable
        sales={sales}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleVerify={handleToggleVerify}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
        userRole={userRole}
      />
      
      <RecordSaleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreate}
        editingSale={editingSale}
        inventory={inventoryList} 
        startWithScanner={startWithScanner} // <--- Pass the state
      />
      
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
    </div>
  );
}