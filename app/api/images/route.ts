import { NextResponse } from "next/server";
import { Pool } from "pg";
import { Image, UploadImageResponse } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const userId = formData.get("userId") as string;
    const plantId = (formData.get("plantId") as string) || null;
    const diagnosisId = (formData.get("diagnosisId") as string) || null;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    // In a real implementation, you would upload the file to a storage service
    // and get back a URL. For this example, we'll simulate that.
    const imageUrl = `https://storage.example.com/${Date.now()}-${imageFile.name}`;

    // Extract metadata from the image file
    const metadata = {
      width: 800, // Example value, would be extracted from actual image
      height: 600, // Example value, would be extracted from actual image
      format: imageFile.type.split("/")[1],
      size: imageFile.size,
    };

    // Insert the image record into the database
    const result = await pool.query<Image>(
      `INSERT INTO images (url, user_id, plant_id, diagnosis_id, uploaded_at, metadata)
       VALUES ($1, $2, $3, $4, NOW(), $5)
       RETURNING *`,
      [imageUrl, userId, plantId, diagnosisId, JSON.stringify(metadata)],
    );

    const uploadedImage = result.rows[0];

    const response: UploadImageResponse = {
      success: true,
      imageId: uploadedImage.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to upload image: ${error}` },
      { status: 500 },
    );
  }
}
