import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Make sure this import is correct
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
// Ensure you are importing the named export 'authOptions' specifically
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function GET() {
  const session = await getServerSession(authOptions);

  // --- DEBUGGING LOGS ---
  console.log("API Session Debug:", JSON.stringify(session, null, 2));
  // ----------------------

  // @ts-ignore
  const userRole = session?.user?.role;

  // Check against both "admin" and "ADMIN" to be safe
  if (!userRole || userRole.toLowerCase() !== "admin") {
    console.log(`Access Denied. User role is: ${userRole}`);
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  
  return NextResponse.json(users);
}