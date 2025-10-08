import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

export const runtime = "nodejs"; // Important: Node runtime required for cloudinary SDK

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    // --- Authenticate user ---
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // --- Get form data ---
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type")?.toString();

    if (!type || !["profile", "product"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (!files || files.length === 0) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadFolder = type === "profile" ? "RoopShree/ProfileImages" : "RoopShree/ProductImages";

    // --- Upload images to Cloudinary ---
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) return NextResponse.json({ error: "Invalid file" }, { status: 400 });
      if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: `Invalid file type ${file.type}` }, { status: 400 });
      if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await cloudinary.uploader.upload_stream({
        folder: uploadFolder,
        resource_type: "image",
      }, (error, result) => {
        if (error) throw error;
        return result;
      });

      // Simpler alternative: Use uploader.upload with temporary file
      // Here we'll convert the buffer to base64:
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResponse = await cloudinary.uploader.upload(dataUri, { folder: uploadFolder });
      uploadedUrls.push(uploadResponse.secure_url);
    }

    // --- Update DB ---
    if (type === "profile") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { profileImage: uploadedUrls[0] },
      });
    } else if (type === "product") {
      const productId = formData.get("productId")?.toString();
      if (!productId) return NextResponse.json({ error: "Product ID missing" }, { status: 400 });

      await prisma.products.update({
        where: { id: productId },
        data: { images: { push: uploadedUrls } },
      });
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Upload failed", details: err instanceof Error ? err.message : "Unknown" }, { status: 500 });
  }
}
