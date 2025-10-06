export type SignupBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type SafeUser = {
  id: number;          // Int from Prisma
  name: string;
  email: string;
  createdAt: string;
};

export interface DecodedUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}


