// /lib/db.js
import mysql from "mysql2/promise";

let pool;

if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "accf",
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,   // << prevents TOO MANY CONNECTIONS
        queueLimit: 0
    });
}

pool = global._mysqlPool;

export default pool;
