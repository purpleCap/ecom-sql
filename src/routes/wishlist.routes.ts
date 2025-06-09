import express, { Router } from "express";
import wishlistController from "../controllers/wishlist.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/add-to-wishlist', isAuth, wishlistController.addToWishlist);


export {router as wishlistRouter};