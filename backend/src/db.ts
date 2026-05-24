import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Bulutli bazaga tashqaridan ulanish uchun SSL konfiguratsiyasi:
  ssl: {
    rejectUnauthorized: false // Self-signed sertifikatlarni qabul qilish uchun
  }
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};