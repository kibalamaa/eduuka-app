export interface InventoryItem {
  id: string;
  item: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  created_at: string | Date;
}

export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  onConfirm?: () => void;
}