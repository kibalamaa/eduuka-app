import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";
import Inventory from "@/app/models/Inventory"; // Needed for stock restoration
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. Define Props with Promise
type Props = {
  params: Promise<{ id: string }>;
};

// 2. Update PATCH
export async function PATCH(req: Request, { params }: Props) {
  // 3. Await params
  const { id } = await params;

  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;
  
  try {
    const body = await req.json();
    await dbConnect();

    // CASE 1: VERIFICATION (Admin or Finance)
    if (body.hasOwnProperty('verified')) {
      if (role !== "admin" && role !== "finance") {
        return NextResponse.json({ message: "Only Finance can verify sales" }, { status: 403 });
      }
    } 
    // CASE 2: EDITING DETAILS (Admin or Staff)
    else {
      // Use 'id'
      const currentSale = await Sale.findById(id);
      
      if (!currentSale) {
        return NextResponse.json({ message: "Sale not found" }, { status: 404 });
      }

      if (currentSale.verified && role !== "admin") {
        return NextResponse.json({ message: "Cannot edit verified sales" }, { status: 403 });
      }
    }

    // Use 'id'
    const updatedSale = await Sale.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedSale);
  } catch (err) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// 4. Update DELETE
export async function DELETE(req: Request, { params }: Props) {
  // 5. Await params
  const { id } = await params;

  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;

  // STRICT: Only Admin can delete sales
  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
  }

  try {
    await dbConnect();

    // Find sale to restore stock
    const saleToDelete = await Sale.findById(id);

    if (!saleToDelete) {
      return NextResponse.json({ message: "Sale not found" }, { status: 404 });
    }

    // Restore Inventory
    const inventoryItem = await Inventory.findOne({ item: saleToDelete.item });
    if (inventoryItem) {
      inventoryItem.quantity += saleToDelete.quantity;
      await inventoryItem.save();
    }

    // Delete Sale
    await Sale.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted and stock restored" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}