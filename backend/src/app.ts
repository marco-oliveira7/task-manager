import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
<<<<<<< HEAD
import categorieRoutes from './routes/categorie.routes';
=======
import categoryRoutes from './routes/category.routes';
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API de tarefas funcionando' });
});

app.use('/api', taskRoutes);
<<<<<<< HEAD
app.use('/api', categorieRoutes);
=======
app.use('/api', categoryRoutes);
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)

export default app;