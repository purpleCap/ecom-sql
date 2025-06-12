import express, { Router } from "express";
import userController from "../controllers/user.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/register', userController.signup);
router.post('/signin', userController.signin);
router.put('/block-unblock/:id', userController.blockUnblock);
router.get('/refresh', userController.getAccessToken);
router.get('/signout', userController.signout);
router.post('/reset-password', isAuth, userController.resetPassword);
router.get('/wishlist', isAuth, userController.getWishlist);
router.get('/cartlist', isAuth, userController.getCartlist);
router.post('/save-address', isAuth, userController.saveAddress);
router.get('/addresses', isAuth, userController.getAddresses);
router.get('/address/:addressId', isAuth, userController.getOneAddress);
router.put('/update-address', isAuth, userController.updateAddress);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


export {router as userRouter};