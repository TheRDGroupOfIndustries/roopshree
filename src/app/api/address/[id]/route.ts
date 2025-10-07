import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
  return null;
}

// UPDATE Address
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: addressId } = await params;
    const user = await authenticate(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    if (!addressId)
      return NextResponse.json(
        { error: "Address id is required" },
        { status: 400 }
      );

    const updateData = await req.json();
    // const error = validateAddress(updateData);
    // if (error) return NextResponse.json({ error }, { status: 400 });
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Address data is required" },
        { status: 400 }
      );
    }

    // Ensure address belongs to user
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== user.userId) {
      return NextResponse.json(
        { error: "Address not found or forbidden" },
        { status: 404 }
      );
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Address PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE Address
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: addressId } = await params;
    const user = await authenticate(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!addressId)
      return NextResponse.json(
        { error: "Address id is required" },
        { status: 400 }
      );

    // Ensure address belongs to user
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== user.userId) {
      return NextResponse.json(
        { error: "Address not found or forbidden" },
        { status: 404 }
      );
    }

    await prisma.address.delete({ where: { id: addressId } });
    return NextResponse.json({ message: "Address deleted", id: addressId });
  } catch (err) {
    console.error("Address DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
