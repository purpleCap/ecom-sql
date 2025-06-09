import express, { Router } from "express";
import cartController from "../controllers/cart.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/add-to-cart', isAuth, cartController.addToCart);


export {router as cartRouter};