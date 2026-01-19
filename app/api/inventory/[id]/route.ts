import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb"; // Adjust path if your lib is in root (@/lib/mongodb)
import Inventory from "@/app/models/Inventory"; // Adjust path if in root (@/models/Inventory)
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

  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    await dbConnect();
    
    // Use 'id'
    const updatedItem = await Inventory.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedItem);
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

  if (role !== "admin") {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }

  try {
    await dbConnect();
    // Use 'id'
    await Inventory.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}