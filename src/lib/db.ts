import mysql from "mysql2/promise";

/**
 * Uses DATABASE_URL (mysql://user:pass@host:port/db?params)
 * Works with TiDB Serverless too.
 */
let _pool: mysql.Pool | null = null;

export function getPool() {
  if (_pool) return _pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // mysql2 supports DSN strings directly
  _pool = mysql.createPool(url);
  return _pool;
}

/** Simple query returning rows */
export async function q<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

/** Exec/prepare returning OkPacket (insertId, etc.) */
export async function exec(sql: string, params?: any[]) {
  const [res] = await getPool().execute(sql, params);
  return res as mysql.OkPacket;
}

/** Convert float[] to a Buffer (useful if you store vectors as BLOB) */
export function floatsToVectorBuffer(vec: number[]): Buffer {
  const buf = Buffer.alloc(vec.length * 4);
  for (let i = 0; i < vec.length; i++) buf.writeFloatLE(vec[i], i * 4);
  return buf;
}

/** TiDB Vector funcs accept JSON string literal for a vector: '[0.1, 0.2, ...]' */
export function toVectorLiteral(vec: number[]): string {
  return JSON.stringify(vec);
}
