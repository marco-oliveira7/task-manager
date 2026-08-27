import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categorie.controller';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', createCategory);

export default router;