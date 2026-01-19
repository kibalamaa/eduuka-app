import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import Inventory from "@/app/models/Inventory";
import { authOptions } from "../../auth/[...nextauth]/route";

// UPDATE ITEM (Admin Only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;

  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
  }

  try {
    const body = await req.json();
    await dbConnect();
    const updatedItem = await Inventory.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedItem);
  } catch (err) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE ITEM (Admin Only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const role = session?.user?.role;

  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
  }

  try {
    await dbConnect();
    await Inventory.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}