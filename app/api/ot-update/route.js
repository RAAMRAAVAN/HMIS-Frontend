// app/api/ot-update/route.js
import mysql from "mysql2/promise";
import { notifyOTUpdate } from "@/lib/sse";
export async function POST(request) {
  let conn;

  try {
    const body = await request.json();

    const {
      entry_id,
      room_id,
      patient_name,
      uhid,
      age,
      gender,
      diagnosis,
      surgeon,
      is_waiting,
      is_in_preop,
      is_under_preparation,
      is_in_ot,
      is_surgery_started,
      is_surgery_completed,
      is_shifted_recovery,
    } = body;

    if (!entry_id || !room_id) {
      return Response.json(
        { success: false, error: "entry_id and room_id are required" },
        { status: 400 }
      );
    }

    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "accf",
      port: 3306,
    });

    const sql = `
      UPDATE ot_entries SET
        patient_name = ?, uhid = ?, age = ?, gender = ?, diagnosis = ?, surgeon = ?,
        is_waiting = ?, is_in_preop = ?, is_under_preparation = ?, is_in_ot = ?, 
        is_surgery_started = ?, is_surgery_completed = ?, is_shifted_recovery = ?
      WHERE entry_id = ?
    `;

    const values = [
      patient_name,
      uhid,
      age,
      gender,
      diagnosis,
      surgeon,
      is_waiting ?? 0,
      is_in_preop ?? 0,
      is_under_preparation ?? 0,
      is_in_ot ?? 0,
      is_surgery_started ?? 0,
      is_surgery_completed ?? 0,
      is_shifted_recovery ?? 0,
      entry_id,
    ];

    const [result] = await conn.execute(sql, values);

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, error: "No record found for this entry_id" },
        { status: 404 }
      );
    }

    // 🔥 Notify SSE clients about the update
    notifyOTUpdate({
      entry_id,
      room_id,
      patient_name,
      uhid,
      age,
      surgeon,
      diagnosis,
      is_waiting,
      is_under_preparation,
      is_in_ot,
      is_surgery_started,
      is_surgery_completed,
      is_shifted_recovery
    });

    return Response.json({
      success: true,
      message: "OT entry updated successfully",
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (conn) conn.end();
  }
}
