"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { InventoryItem, AlertState } from "../../types/inventory";

import InventoryHeader from "@/app/components/InventoryHeader";
import InventoryStats from "@/app/components/InventoryStats";
import InventoryTable from "@/app/components/InventoryTable";
import AddStockModal from "@/app/components/AddStockModal";
import AlertDialog from "@/app/components/AlertDialog";
import QrLabelModal from "@/app/components/QrLabelModal"; // <--- IMPORT NEW MODAL

export default function InventoryPage() {
  const { data: session } = useSession();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false); // <--- NEW STATE
  
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [labelItem, setLabelItem] = useState<InventoryItem | null>(null); // <--- NEW STATE

  const [searchTerm, setSearchTerm] = useState("");
  
  const [alertConfig, setAlertConfig] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // @ts-ignore
  const userRole = session?.user?.role || "staff";

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory");
      const data = await res.json();
      
      const formatted = data.map((item: any) => ({
        ...item,
        id: item._id,
      }));
      setInventory(formatted);
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to load inventory.", "danger");
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

  // 2. Create or Update
  const handleSave = async (data: any) => {
    try {
      const payload = {
        item: data.item,
        description: data.description,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        category: data.category
      };

      if (editingItem) {
        // Update
        const res = await fetch(`/api/inventory/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        showAlert("Success", "Stock updated successfully.", "success");
      } else {
        // Create
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Creation failed");
        showAlert("Success", "Stock added successfully.", "success");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      showAlert("Failed", err.message, "warning");
    }
  };

  // 3. Delete
  const handleDeleteClick = (id: string) => {
    showAlert("Delete Item?", "Are you sure? This removes the item from stock permanently.", "danger", () => performDelete(id));
  };

  const performDelete = async (id: string) => {
    closeAlert();
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setInventory((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      showAlert("Error", err.message, "warning");
    }
  };

  // 4. Modal Handlers
  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handlePrintLabel = (item: InventoryItem) => {
    setLabelItem(item);
    setIsLabelModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 md:p-8">
      <InventoryHeader onOpenModal={() => setIsModalOpen(true)} />
      
      <InventoryStats inventory={inventory} />
      
      <InventoryTable
        inventory={inventory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
        onPrintLabel={handlePrintLabel} // <--- Pass the new handler
        userRole={userRole}
      />

      {/* Edit/Create Modal */}
      <AddStockModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSave}
        editingItem={editingItem}
      />

      {/* QR Label Modal */}
      <QrLabelModal 
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        item={labelItem}
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