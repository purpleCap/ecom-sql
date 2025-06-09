import express, { Router } from 'express';
import isAuth from '../middleware/is-auth';
import isAdmin from '../middleware/is-admin';
import couponController from '../controllers/coupon.controller';

const router: Router = express.Router();

router.post('/create', isAuth, isAdmin, couponController.createCoupon);
router.put('/update', isAuth, isAdmin, couponController.updateCoupon);
router.delete('/delete/:id', isAuth, isAdmin, couponController.deleteCoupon);
router.get('/:id', couponController.getCoupon);
router.get('/', couponController.getAllCoupons);

export { router as couponRouter };
