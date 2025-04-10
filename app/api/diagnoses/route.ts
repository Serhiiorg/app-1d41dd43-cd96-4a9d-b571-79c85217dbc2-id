import { NextResponse } from "next/server";
import { Pool } from "pg";
import {
  Diagnosis,
  DiagnosisResult,
  Disease,
  Symptom,
  Treatment,
} from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query<Diagnosis>("SELECT * FROM diagnoses");

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to fetch diagnoses: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 },
      );
    }

    // 1. Create a new diagnosis entry
    const diagnosisResult = await pool.query<Diagnosis>(
      "INSERT INTO diagnoses (plant_id, disease_id, user_id, confidence, diagnosed_at, status) " +
        "SELECT i.plant_id, d.id, i.user_id, 0.85, NOW(), 'pending' " +
        "FROM images i " +
        "CROSS JOIN (SELECT id FROM diseases ORDER BY RANDOM() LIMIT 1) d " +
        "WHERE i.id = $1 " +
        "RETURNING *",
      [imageId],
    );

    if (diagnosisResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to create diagnosis" },
        { status: 500 },
      );
    }

    const diagnosis = diagnosisResult.rows[0];

    // 2. Get disease details
    const diseaseResult = await pool.query<Disease>(
      "SELECT * FROM diseases WHERE id = $1",
      [diagnosis.diseaseId],
    );

    if (diseaseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Disease not found" },
        { status: 500 },
      );
    }

    // 3. Get symptoms for this disease
    const symptomsResult = await pool.query<Symptom>(
      "SELECT s.* FROM symptoms s " +
        "JOIN disease_symptoms ds ON s.id = ds.symptom_id " +
        "WHERE ds.disease_id = $1",
      [diagnosis.diseaseId],
    );

    // 4. Get possible treatments
    const treatmentsResult = await pool.query<Treatment>(
      "SELECT * FROM treatments WHERE disease_id = $1",
      [diagnosis.diseaseId],
    );

    // 5. Construct the diagnosis result
    const diagnosisResultData: DiagnosisResult = {
      diagnosisId: diagnosis.id,
      disease: diseaseResult.rows[0],
      confidence: diagnosis.confidence,
      symptoms: symptomsResult.rows,
      possibleTreatments: treatmentsResult.rows,
    };

    // Update the image with the diagnosis ID
    await pool.query("UPDATE images SET diagnosis_id = $1 WHERE id = $2", [
      diagnosis.id,
      imageId,
    ]);

    return NextResponse.json({
      success: true,
      data: diagnosisResultData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to create diagnosis: ${error}` },
      { status: 500 },
    );
  }
}
