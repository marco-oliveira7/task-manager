import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface CategorieRow extends RowDataPacket {
  id: number;
  title: string;
}

// function normalizeTask(row: TaskRow) {
//   return {
//     id: row.id,
//     title: row.title,
//     description: row.description,
//     completed: row.completed === 1 || row.completed === true,
//     created_at: row.created_at,
//   };
// }

export async function getCategories(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<CategorieRow[]>(
      'SELECT id, title FROM categories ORDER BY title ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ message: 'Erro ao listar categorias' });
  }
}

export async function createCategory(req: Request, res: Response) {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'O título da categoria é obrigatório' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (title) VALUES (?)',
      [title.trim()]
    );

    const [rows] = await pool.query<CategorieRow[]>(
      'SELECT id, title FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
}