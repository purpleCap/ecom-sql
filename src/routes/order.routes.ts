import express, { Router } from "express";
import orderController from "../controllers/order.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/create', isAuth, orderController.placeOrder);


export {router as orderRouter};