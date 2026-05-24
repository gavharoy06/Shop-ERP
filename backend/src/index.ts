import express, { Request, Response } from 'express';
import cors from 'cors';
import { query } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Bulutli Load Balancer uchun Health Check (Juda muhim!)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'ERP Backend is running smoothly.' });
});

// 2. Ombor mahsulotlarini olish (GET)
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: 'Server xatoligi yuz berdi.' });
  }
});

// 3. Ombborga yangi mahsulot qo'shish (POST)
app.post('/api/products', async (req: Request, res: Response) => {
  const { sku, name, quantity, price } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (sku, name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [sku, name, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: 'Mahsulot qoʻshishda xatolik (SKU band boʻlishi mumkin).' });
  }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`🚀 ERP Backend server ${PORT}-portda muvaffaqiyatli ishlamoqda...`);
});