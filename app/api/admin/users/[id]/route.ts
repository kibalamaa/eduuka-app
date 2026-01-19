import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // Security Check: Only Admins can promote/demote
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
    const updatedUser = await User.findByIdAndUpdate(
      params.id, 
      { role }, 
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}