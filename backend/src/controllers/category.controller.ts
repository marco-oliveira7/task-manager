import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface CategoryRow extends RowDataPacket {
  id: number;
  title: string;
}

export async function getCategories(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<CategoryRow[]>(
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

  const trimmedTitle = title.trim();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (title) VALUES (?)',
      [trimmedTitle]
    );

    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT id, title FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
}
