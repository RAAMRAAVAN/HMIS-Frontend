import pool from "@/lib/db";
import { notifyOTUpdate } from "@/lib/sse";

export async function POST(request) {
    let conn;
    try {
        const body = await request.json();

        // Get a pooled connection
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Cancel last active OT entry for this room
        const updateEntrySql = `
            UPDATE ot_entries 
            SET is_cancelled = 1 
            WHERE entry_id = ?
        `;
        await conn.execute(updateEntrySql,[body.entry_id]);

        await conn.commit();

        // 🔥 Notify SSE clients about the update
        notifyOTUpdate({
            action: "cancel",
        });

        return Response.json({
            success: true,
            message: "OT cancelled and room freed"
        });

    } catch (err) {
        if (conn) await conn.rollback();

        return Response.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    } finally {
        if (conn) conn.release(); // VERY IMPORTANT for pool
    }
}
