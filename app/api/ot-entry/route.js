import pool from "@/lib/db";
import { notifyOTUpdate } from "@/lib/sse";

export async function POST(request) {
    let conn;

    try {
        const body = await request.json();

        // Get current date & time
        const now = new Date();

        // Format YYYY-MM-DD
        const admissionDate = now.toISOString().slice(0, 10);

        // Format HH:MM:SS
        const admissionTime = now.toTimeString().slice(0, 8);

        // Get pooled connection
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Insert new entry
        const insertSql = `
            INSERT INTO ot_entries 
            (room_id, patient_name, uhid, age, gender, diagnosis, surgeon, 
             active_status, is_waiting, admission_date, admission_time, is_under_preparation, is_in_preop)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const insertValues = [
            body.room_id,
            body.PatientName,
            body.UHID,
            body.Age,
            body.Gender,
            body.Diagnosis,
            body.Surgeon,
            1,  // active_status = 1
            1,  // is_waiting = 1
            admissionDate,
            admissionTime,
            0,
            0
        ];

        await conn.execute(insertSql, insertValues);

        // Update room occupancy
        const updateSql = `
            UPDATE ot_rooms
            SET occupancy_status = 1
            WHERE room_id = ?
        `;

        await conn.execute(updateSql, [body.room_id]);

        // Commit everything
        await conn.commit();

        // 🔥 Notify SSE clients
        notifyOTUpdate({ status: 'received' });

        return Response.json({
            success: true,
            message: "Inserted & room updated successfully"
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
