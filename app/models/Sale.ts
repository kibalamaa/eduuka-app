// models/Sale.ts
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  description: { type: String },
  item: { type: String, required: true }, 
  quantity: { type: Number, default: 1 }, // Added quantity
  amount: { type: Number, required: true },
  category: { type: String, default: "General" },
  verified: { type: Boolean, default: false },
  created_by: { type: String, required: true }, // Stores email
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);