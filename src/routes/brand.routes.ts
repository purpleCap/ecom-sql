import express, { Router } from 'express';
import isAuth from '../middleware/is-auth';
import isAdmin from '../middleware/is-admin';
import brandController from '../controllers/brand.controller';

const router: Router = express.Router();

router.post('/create', isAuth, isAdmin, brandController.createBrand);
router.put('/update', isAuth, isAdmin, brandController.updateBrand);
router.delete('/delete/:id', isAuth, isAdmin, brandController.deleteBrand);
router.get('/:id', brandController.getBrand);
router.get('/', brandController.getAllBrand);

export { router as brandRouter };
