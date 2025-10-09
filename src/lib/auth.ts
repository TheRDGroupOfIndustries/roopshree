import { DecodedUser } from "@/types/auth";
import { NextRequest } from "next/server";
import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function authenticateAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      throw new Error("Unauthorized access: No token found");
    }

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as unknown as DecodedUser;
    // console.log("decoded", decoded);
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access: Invalid token or not an admin");
    }

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Unauthorized access: Invalid token or not an admin");
  }
}
