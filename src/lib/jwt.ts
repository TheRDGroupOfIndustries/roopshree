import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "super_secret_key";
const JWT_EXP: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export interface AuthPayload {
  userId: number;
  name: string;
  email: string;
}

export const signJwt = (payload: AuthPayload): string => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
export const verifyJwt = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
};
