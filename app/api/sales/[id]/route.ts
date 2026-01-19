import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";      
import Inventory from "@/app/models/Inventory"; 
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;
  
  try {
    const body = await req.json();
    await dbConnect();

    // verify
    if (body.hasOwnProperty('verified')) {
      if (role !== "admin" && role !== "finance") {
        return NextResponse.json({ message: "Only Finance can verify sales" }, { status: 403 });
      }
    } 
  
    else {
      // Check if sale is already verified (Locked)
      const currentSale = await Sale.findById(params.id);
      
      if (!currentSale) {
        return NextResponse.json({ message: "Sale not found" }, { status: 404 });
      }

      if (currentSale.verified && role !== "admin") {
        return NextResponse.json({ message: "Cannot edit verified sales" }, { status: 403 });
      }


    }

    const updatedSale = await Sale.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedSale);
  } catch (err) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;

  // STRICT: Only Admin can delete sales
  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
  }

  try {
    await dbConnect();

    // find the sale first so we know what was sold
    const saleToDelete = await Sale.findById(params.id);

    if (!saleToDelete) {
      return NextResponse.json({ message: "Sale not found" }, { status: 404 });
    }

    
    // look for the item by name. 
    const inventoryItem = await Inventory.findOne({ item: saleToDelete.item });

    if (inventoryItem) {
      // Add the sold quantity back to stock
      inventoryItem.quantity += saleToDelete.quantity;
      await inventoryItem.save();
    }

    // 3. Delete the sale record
    await Sale.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted and stock restored" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}