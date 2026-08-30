import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API de tarefas funcionando' });
});

app.use('/api', taskRoutes);
app.use('/api', categoryRoutes);

export default app;