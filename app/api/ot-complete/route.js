import pool from "@/lib/db";
import { notifyOTUpdate } from "@/lib/sse";

export async function POST(request) {
    let conn;

    try {
        const body = await request.json();

        // 🔥 Get current IST date & time
        const now = new Date();

        // Format YYYY-MM-DD
        const dischargeDate = now.toISOString().slice(0, 10);

        // Format HH:MM:SS
        const dischargeTime = now.toTimeString().slice(0, 8);

        // Get pooled connection
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Update discharge info for OT entry
        const updateEntrySql = `
            UPDATE ot_entries 
            SET discharge_date = ?,
                discharge_time = ?
            WHERE entry_id = ?
        `;

        await conn.execute(updateEntrySql, [
            dischargeDate,
            dischargeTime,
            body.entry_id
        ]);

        // Mark room as empty
        const updateRoomSql = `
            UPDATE ot_rooms 
            SET occupancy_status = 0 
            WHERE room_id = ?
        `;

        await conn.execute(updateRoomSql, [body.room_id]);

        // Commit transaction
        await conn.commit();

        // Notify SSE clients
        notifyOTUpdate({
            action: "discharge",
            entry_id: body.entry_id
        });

        return Response.json({
            success: true,
            message: "Patient discharged and room freed"
        });

    } catch (err) {
        if (conn) await conn.rollback();

        return Response.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    } finally {
        if (conn) conn.release();
    }
}
