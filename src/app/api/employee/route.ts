import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { Gender } from "../../../generated/prisma/client";

//Get all Employee
export async function GET() {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!payload.role.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized admin" },
        { status: 401 }
      );
    }

    const userId = payload.userId.toString();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//create Employee
interface CreateEmployeeBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  position: string;
  salary: number;
}

//create Employee
export async function POST(req: Request) {
  try {
    const requestCookies = cookies();
    const body = (await req.json()) as CreateEmployeeBody;

    if (body.gender) {
      const upperGender = body.gender.toUpperCase() as keyof typeof Gender;
      body.gender = Gender[upperGender];
    }

    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!payload.role.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized admin" },
        { status: 401 }
      );
    }

    const userId = payload.userId.toString();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      position,
      salary,
    } = body;

    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee already exists" },
        { status: 401 }
      );
    }

    const product = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        position,
        salary,
        userId: userId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

