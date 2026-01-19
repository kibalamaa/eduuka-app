import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// 1. Define the type correctly for Next.js 15/16
type Props = {
  params: Promise<{ id: string }>;
};

// 2. Update the function signature to use Props
export async function PATCH(req: Request, { params }: Props) {
  // 3. AWAIT the params before using them
  const { id } = await params;

  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { role } = body;

    // Validate role
    if (!["admin", "finance", "staff"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await dbConnect();
    
    // Use 'id' (extracted from await params)
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}