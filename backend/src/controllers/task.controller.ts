import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  completed: number | boolean;
  created_at: string;
  id_categories: number;
  category_title: string | null;
}

function normalizeTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1 || row.completed === true,
    created_at: row.created_at,
    id_categories: row.id_categories,
    category_title: row.category_title || undefined,
  };
}

export async function getTasks(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       ORDER BY t.created_at DESC`
    );
    res.json(rows.map(normalizeTask));
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ message: 'Erro ao listar tarefas' });
  }
}

export async function createTask(req: Request, res: Response) {
  const { title, description, id_categories, categoryId } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
  }

  const categoryIdToUse = Number(id_categories ?? categoryId);
  if (!Number.isInteger(categoryIdToUse) || categoryIdToUse <= 0) {
    return res.status(400).json({ message: 'A categoria da tarefa é obrigatória e deve ser válida' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, description, id_categories) VALUES (?, ?, ?)',
      [
        title.trim(),
        description && description.trim() !== '' ? description.trim() : null,
        categoryIdToUse,
      ]
    );

    const [rows] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json(normalizeTask(rows[0]));
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
}

export async function updateTask(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const { title, description, completed, id_categories, categoryId } = req.body;

  try {
    const [rows] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const current = rows[0];
    const newTitle = title !== undefined ? String(title).trim() : current.title;
    const newDescription =
      description !== undefined
        ? description === null || String(description).trim() === ''
          ? null
          : String(description).trim()
        : current.description;
    const newCompleted =
      completed !== undefined ? (completed === true || completed === 1 ? 1 : 0) : current.completed;

    const rawCat = id_categories ?? categoryId;
    const newIdCategories =
      rawCat !== undefined && Number.isInteger(Number(rawCat)) && Number(rawCat) > 0
        ? Number(rawCat)
        : current.id_categories;

    if (newTitle === '') {
      return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    await pool.query<ResultSetHeader>(
      'UPDATE tasks SET title = ?, description = ?, completed = ?, id_categories = ? WHERE id = ?',
      [newTitle, newDescription, newCompleted, newIdCategories, id]
    );

    const [updated] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
      [id]
    );

    res.json(normalizeTask(updated[0]));
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
}