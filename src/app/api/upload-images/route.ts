import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    // --- Authenticate user ---
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Get form data ---
    const formData = await req.formData();
    const files = formData.getAll("files");
    const type = formData.get("type")?.toString();

    // --- Validate type first ---
    if (!type || !["profile", "product"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'profile' or 'product'" },
        { status: 400 }
      );
    }

    // --- Validate files exist ---
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // --- Profile-specific validations (BEFORE upload) ---
    if (type === "profile") {
      if (files.length > 1) {
        return NextResponse.json(
          { error: "Profile image can only be 1 file" },
          { status: 400 }
        );
      }
    }

    // --- Product-specific validations (BEFORE upload) ---
    if (type === "product") {
      if (!payload.role?.includes("ADMIN")) {
        return NextResponse.json(
          { error: "Only admins can upload product images" },
          { status: 403 }
        );
      }

      const productId = formData.get("productId")?.toString();
      if (!productId) {
        return NextResponse.json(
          { error: "Product ID is required" },
          { status: 400 }
        );
      }

      // Check product exists BEFORE uploading
      const product = await prisma.products.findUnique({
        where: { id: productId },
      });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Store productId for later use
      formData.set("_validatedProductId", productId);
    }

    // --- Validate each file ---
    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Invalid file format" },
          { status: 400 }
        );
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP allowed` },
          { status: 400 }
        );
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size is 5MB` },
          { status: 400 }
        );
      }
    }

    // --- Determine Cloudinary folder ---
    const uploadFolder =
      type === "profile"
        ? "RoopShree/ProfileImages"
        : "RoopShree/ProductImages";

    // --- Upload files to Cloudinary ---
    const uploadPromises = files.map(async (file) => {
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
          folder: uploadFolder,
          resource_type: "image",
        });

        return uploadResponse.secure_url;
      }
      return "";
    });

    const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);

    // --- Update database ---
    if (type === "profile") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { profileImage: imageUrls[0] },
      });
    }

    if (type === "product") {
      const productId = formData.get("_validatedProductId")?.toString();
      
      if (!productId) {
        return NextResponse.json(
          { error: "Product ID validation failed" },
          { status: 500 }
        );
      }

      await prisma.products.update({
        where: { id: productId },
        data: { images: { push: imageUrls } },
      });
    }

    return NextResponse.json({
      success: true,
      urls: imageUrls,
      message: `${type} image(s) uploaded successfully`,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}