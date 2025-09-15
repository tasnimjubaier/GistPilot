import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: true },
});

export async function q<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function exec(sql: string, params: any[] = []) {
  const [res] = await pool.execute(sql, params);
  return res as any;
}
