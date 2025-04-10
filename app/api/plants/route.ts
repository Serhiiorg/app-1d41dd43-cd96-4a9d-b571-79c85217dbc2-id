import { NextResponse } from "next/server";
import { Pool } from "pg";
import { Plant } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query<Plant>("SELECT * FROM plants");

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to fetch plants: ${error}` },
      { status: 500 },
    );
  }
}
