import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXP = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export const signJwt = (payload: object): string => {
  const options: SignOptions = { expiresIn: JWT_EXP };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
