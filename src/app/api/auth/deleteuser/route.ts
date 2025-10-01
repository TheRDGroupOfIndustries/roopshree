import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(req: Request) {  
  try {
    const body = await req.json();
    const { email } = body;
    await prisma.user.delete({ where: { email } });
    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
// identify the total user just a checker
export async function GET(req: Request) {  
  try {
   const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};