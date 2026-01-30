import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "52428800"); // 50MB (video safe)

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  const BANNER_DIMENSIONS = {
    width: parseInt(process.env.BANNER_WIDTH || "1280"),
    height: parseInt(process.env.BANNER_HEIGHT || "1280"),
  };

  try {
    // 🔐 Auth
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload?.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type")?.toString();

    // ✅ FIX 1: type validation
    const VALID_TYPES = ["profile", "product", "banner", "video"];
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type: ${type}` },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    // 📁 Folder mapping
    let uploadFolder = "";
    let resourceType: "image" | "video" = "image";

    switch (type) {
      case "profile":
        uploadFolder = "RoopShree/ProfileImages";
        break;
      case "product":
        uploadFolder = "RoopShree/ProductImages";
        break;
      case "banner":
        uploadFolder = "RoopShree/BannerImages";
        break;
      case "video":
        uploadFolder = "RoopShree/Videos";
        resourceType = "video";
        break;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Invalid file" }, { status: 400 });
      }

      // ✅ FIX 2: MIME validation
      if (resourceType === "image") {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `Invalid image type: ${file.type}` },
            { status: 400 }
          );
        }
      } else {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `Invalid video type: ${file.type}` },
            { status: 400 }
          );
        }
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      // 🎯 Banner dimension check
      if (type === "banner") {
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
          folder: uploadFolder,
          resource_type: "image",
        });

        if (
          uploadResponse.width !== BANNER_DIMENSIONS.width ||
          uploadResponse.height !== BANNER_DIMENSIONS.height
        ) {
          await cloudinary.uploader.destroy(uploadResponse.public_id);

          return NextResponse.json(
            {
              error: `Banner must be ${BANNER_DIMENSIONS.width}x${BANNER_DIMENSIONS.height}px`,
            },
            { status: 400 }
          );
        }

        uploadedUrls.push(uploadResponse.secure_url);
        continue;
      }

      // 🚀 Normal upload (image / video)
      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: uploadFolder,
        resource_type: resourceType,
      });

      uploadedUrls.push(uploadResponse.secure_url);
    }

    // 🧠 DB updates
    if (type === "profile") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { profileImage: uploadedUrls[0] },
      });
    }

    if (type === "product") {
      const productId = formData.get("productId")?.toString();
      if (!productId)
        return NextResponse.json(
          { error: "Product ID missing" },
          { status: 400 }
        );

      await prisma.products.update({
        where: { id: productId },
        data: { images: { push: uploadedUrls } },
      });
    }

    if (type === "banner") {
      const bannerId = formData.get("bannerId")?.toString();
      if (!bannerId)
        return NextResponse.json(
          { error: "Banner ID missing" },
          { status: 400 }
        );

      await prisma.banners.update({
        where: { id: bannerId },
        data: { image: uploadedUrls[0] },
      });
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: err instanceof Error ? err.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
