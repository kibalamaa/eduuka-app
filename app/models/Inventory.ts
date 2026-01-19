import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  item: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Unit Price
  quantity: { type: Number, default: 0 },  // Current Stock
  category: { type: String, default: "General" },
  low_stock_threshold: { type: Number, default: 5 }, // Alert level
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);