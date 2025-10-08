import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/jwt";
import { postcodeValidator } from "postcode-validator"; // ✅ added import

// Validation helper
function validateAddress(data: any) {
  const requiredFields = [
    "address",
    "city",
    "state",
    "country",
    "zipCode",
    "phone",
    "name",
  ];
  for (const field of requiredFields) {
    if (
      !data[field] ||
      typeof data[field] !== "string" ||
      !data[field].trim()
    ) {
      return `Field '${field}' is required and must be a non-empty string.`;
    }
  }

  // ✅ Added ZIP code validation (only change)
  const isValidZip = postcodeValidator(data.zipCode, data.country);
  if (!isValidZip) {
    return `Invalid ZIP/postal code for the country '${data.country}'.`;
  }

  return null;
}

// CREATE Address
export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const error = validateAddress(data);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const existingAddressCount = await prisma.address.count({
      where: { userId: user.userId },
    });

    if (existingAddressCount >= 2) {
      return NextResponse.json(
        { error: "Maximum number of addresses reached" },
        { status: 400 }
      );
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        userId: user.userId,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (err) {
    console.error("Address POST error:", err);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

// GET all addresses for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
    });

    return NextResponse.json(addresses);
  } catch (err) {
    console.error("Address GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}
