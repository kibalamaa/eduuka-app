// types/expenses.ts
export interface Sale {
  id: string; // MongoDB _id
  item: string;
  quantity: number;
  amount: number;
  description: string;
  category: string;
  verified: boolean;
  created_by: string;
  created_at: string | Date;
}



export type Inventory = {
  id: string;
  description: string;
  unit_price: number;
  status: 'low' | 'good' | 'high' ;
  units: number;
}



export type BudgetOption = {
  id: string;
  department: string;
  amount: number;
  used?: number;
  period?: string;
};

export type AlertState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  onConfirm?: () => void;
};
