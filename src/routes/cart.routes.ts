import express, { Router } from "express";
import cartController from "../controllers/cart.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/add-to-cart', isAuth, cartController.addToCart);
router.put('/remove-item', isAuth, cartController.removeItem);
router.put('/update-cart-item-qty', isAuth, cartController.updateQuantity);


export {router as cartRouter};