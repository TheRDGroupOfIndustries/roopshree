import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (typeof file !== "string") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert buffer to base64
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
          folder: "RoopShree", // optional: customize your folder
        });

        return uploadResponse.secure_url;
      }
      // Handle the case where file is a string (e.g., return an empty string or throw an error)
      return "";
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls: imageUrls });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
