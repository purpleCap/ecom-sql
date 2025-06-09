import express, { Router } from 'express';
import categoryController from '../controllers/category.controller';
import isAuth from '../middleware/is-auth';
import isAdmin from '../middleware/is-admin';

const router: Router = express.Router();

router.post('/create', isAuth, isAdmin, categoryController.createCategory);
router.put('/update', isAuth, isAdmin, categoryController.updateCategory);
router.delete('/delete/:id', isAuth, isAdmin, categoryController.deleteCategory);
router.get('/:id', categoryController.getCategory);
router.get('/', categoryController.getAllCategory);

export { router as categoryRouter };
