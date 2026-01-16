import { DecodedUser } from "@/types/auth";
import { NextRequest } from "next/server";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export const signJwt = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyJwt = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
};

export function authenticate(req: NextRequest): DecodedUser | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedUser;
  } catch (err) {
    console.error("JWT verify failed", err);
    return null;
  }
}
