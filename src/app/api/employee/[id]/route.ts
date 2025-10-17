import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { Gender } from "@prisma/client";


import { promises } from "dns";

interface UpdateEmployeeBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  position?: string;
  salary?: number;
}

// ✅ GET - Fetch single employee
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!payload.role.includes("ADMIN"))
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    if (employee.userId !== payload.userId.toString())
      return NextResponse.json({ error: "Unauthorized - Not your employee" }, { status: 403 });

    return NextResponse.json(employee);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update employee
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!payload.role.includes("ADMIN"))
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    if (employee.userId !== payload.userId.toString())
      return NextResponse.json({ error: "Unauthorized - Not your employee" }, { status: 403 });

    const body = (await req.json()) as UpdateEmployeeBody;

    // Convert gender safely
    if (body.gender) {
      const upperGender = body.gender.toUpperCase() as keyof typeof Gender;
      body.gender = Gender[upperGender];
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Delete employee
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!payload.role.includes("ADMIN"))
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    if (employee.userId !== payload.userId.toString())
      return NextResponse.json({ error: "Unauthorized - Not your employee" }, { status: 403 });

    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
