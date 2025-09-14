import { getPool } from './db'

export async function migrate() {
  const pool = getPool()
  // Create tables (idempotent)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      outline_json JSON NOT NULL,
      status ENUM('PENDING','READY','FAILED') DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      ord INT NOT NULL,
      CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id VARCHAR(36) PRIMARY KEY,
      module_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content MEDIUMTEXT NOT NULL,
      ord INT NOT NULL,
      embedding_json JSON NULL,
      CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`)
}