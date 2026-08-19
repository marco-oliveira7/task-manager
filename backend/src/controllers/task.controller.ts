import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  completed: number | boolean;
  created_at: string;
}

function normalizeTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1 || row.completed === true,
    created_at: row.created_at,
  };
}

export async function getTasks(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<TaskRow[]>(
      'SELECT id, title, description, completed, created_at FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows.map(normalizeTask));
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ message: 'Erro ao listar tarefas' });
  }
}

export async function createTask(req: Request, res: Response) {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title.trim(), description && description.trim() !== '' ? description.trim() : null]
    );

    const [rows] = await pool.query<TaskRow[]>(
      'SELECT id, title, description, completed, created_at FROM tasks WHERE id = ?',
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

  const { title, description, completed } = req.body;

  try {
    const [rows] = await pool.query<TaskRow[]>(
      'SELECT id, title, description, completed, created_at FROM tasks WHERE id = ?',
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

    if (newTitle === '') {
      return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    await pool.query<ResultSetHeader>(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [newTitle, newDescription, newCompleted, id]
    );

    const [updated] = await pool.query<TaskRow[]>(
      'SELECT id, title, description, completed, created_at FROM tasks WHERE id = ?',
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