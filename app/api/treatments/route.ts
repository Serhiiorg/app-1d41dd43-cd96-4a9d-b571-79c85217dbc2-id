import { NextResponse } from "next/server";
import { Pool } from "pg";
import { Treatment } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const diseaseId = searchParams.get("diseaseId");

    let query = "SELECT * FROM treatments";
    let params: string[] = [];

    if (diseaseId) {
      query += " WHERE disease_id = $1";
      params.push(diseaseId);
    }

    const result = await pool.query<Treatment>(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to fetch treatments: ${error}` },
      { status: 500 },
    );
  }
}
