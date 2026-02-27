import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Handler receives a single `request` argument
export async function GET(request) {
  // Extract room_id from the URL
  const url = new URL(request.url);
  const room_id = url.pathname.split("/").pop(); // last segment is room_id
  let conn;

  try {
    conn = await pool.getConnection();

    const sql = `
      SELECT *
      FROM ot_entries
      WHERE room_id = ?
      ORDER BY entry_id DESC
      LIMIT 1
    `;

    const [rows] = await conn.execute(sql, [room_id]);

    return NextResponse.json({
      success: true,
      data: rows.length ? rows[0] : null,
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
