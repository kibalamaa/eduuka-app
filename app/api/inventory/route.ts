import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Inventory from "@/app/models/Inventory";

export async function GET() {
  await dbConnect();
  // Sort by item name alphabetically
  const items = await Inventory.find({}).sort({ item: 1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const newItem = await Inventory.create({
      item: body.item,
      description: body.description,
      price: body.price,
      quantity: body.quantity,
      category: body.category || "General",
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}