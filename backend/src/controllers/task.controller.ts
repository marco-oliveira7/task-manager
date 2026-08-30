import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  completed: number | boolean;
  created_at: string;
<<<<<<< HEAD
  id_categories: number;
=======
  id_categories: number | null;
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
  category_title: string | null;
}

const TASK_SELECT_QUERY = `
  SELECT 
    t.id, 
    t.title, 
    t.description, 
    t.completed, 
    t.created_at, 
    t.id_categories, 
    c.title AS category_title 
  FROM tasks t 
  LEFT JOIN categories c ON t.id_categories = c.id
`;

function normalizeTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1 || row.completed === true,
    created_at: row.created_at,
<<<<<<< HEAD
    id_categories: row.id_categories,
    category_title: row.category_title || undefined,
=======
    id_categories: row.id_categories ?? null,
    category_title: row.category_title ?? null,
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
  };
}

export async function getTasks(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<TaskRow[]>(
<<<<<<< HEAD
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       ORDER BY t.created_at DESC`
=======
      `${TASK_SELECT_QUERY} ORDER BY t.created_at DESC`
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
    );
    res.json(rows.map(normalizeTask));
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ message: 'Erro ao listar tarefas' });
  }
}

export async function createTask(req: Request, res: Response) {
<<<<<<< HEAD
  const { title, description, id_categories, categoryId } = req.body;
=======
  const { title, description, id_categories } = req.body;
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
  }

<<<<<<< HEAD
  const categoryIdToUse = Number(id_categories ?? categoryId);
  if (!Number.isInteger(categoryIdToUse) || categoryIdToUse <= 0) {
    return res.status(400).json({ message: 'A categoria da tarefa é obrigatória e deve ser válida' });
  }
=======
  const categoryId =
    id_categories !== undefined && id_categories !== null && id_categories !== ''
      ? Number(id_categories)
      : null;
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, description, id_categories) VALUES (?, ?, ?)',
      [
        title.trim(),
        description && description.trim() !== '' ? description.trim() : null,
<<<<<<< HEAD
        categoryIdToUse,
=======
        categoryId,
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
      ]
    );

    const [rows] = await pool.query<TaskRow[]>(
<<<<<<< HEAD
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
=======
      `${TASK_SELECT_QUERY} WHERE t.id = ?`,
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
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

<<<<<<< HEAD
  const { title, description, completed, id_categories, categoryId } = req.body;

  try {
    const [rows] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
=======
  const { title, description, completed, id_categories } = req.body;

  try {
    const [rows] = await pool.query<TaskRow[]>(
      `${TASK_SELECT_QUERY} WHERE t.id = ?`,
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
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
    const newCategoryId =
      id_categories !== undefined
        ? id_categories === null || id_categories === ''
          ? null
          : Number(id_categories)
        : current.id_categories;

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
<<<<<<< HEAD
      [newTitle, newDescription, newCompleted, newIdCategories, id]
    );

    const [updated] = await pool.query<TaskRow[]>(
      `SELECT t.id, t.title, t.description, t.completed, t.created_at, t.id_categories, c.title AS category_title 
       FROM tasks t 
       LEFT JOIN categories c ON t.id_categories = c.id 
       WHERE t.id = ?`,
=======
      [newTitle, newDescription, newCompleted, newCategoryId, id]
    );

    const [updated] = await pool.query<TaskRow[]>(
      `${TASK_SELECT_QUERY} WHERE t.id = ?`,
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
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