import pool from "@/lib/db";

export async function GET() {
    let conn;

    try {
        conn = await pool.getConnection();

        const [rows] = await conn.query("SELECT * FROM ot_entries order by entry_id desc");

        return Response.json(rows, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });

    } finally {
        if (conn) conn.release();
    }
}
