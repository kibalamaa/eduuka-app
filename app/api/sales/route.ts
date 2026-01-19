import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";
import Inventory from "@/app/models/Inventory";
// FIX: Import the named export 'authOptions' we created above
import { authOptions } from "../auth/[...nextauth]/route"; 

export async function GET() {
  await dbConnect();
  const sales = await Sale.find({}).sort({ created_at: -1 });
  return NextResponse.json(sales);
}

export async function POST(req: Request) {
  // FIX: Pass authOptions to getServerSession
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    // 1. Check if item exists in Inventory
    const inventoryItem = await Inventory.findOne({ item: data.item });

    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Item not found in inventory. Please add stock first." }, 
        { status: 400 }
      );
    }

    // 2. Check if enough stock exists
    const quantityToSell = parseInt(data.quantity);
    if (inventoryItem.quantity < quantityToSell) {
      return NextResponse.json(
        { message: `Insufficient stock. Only ${inventoryItem.quantity} units available.` }, 
        { status: 400 }
      );
    }

    // 3. Deduct stock
    inventoryItem.quantity -= quantityToSell;
    await inventoryItem.save();

    // 4. Create Sale Record
    const newSale = await Sale.create({
      ...data,
      created_by: session.user?.email,
      verified: false,
    });

    return NextResponse.json(newSale, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}