import express, { Router } from "express";
import paymentController from "../controllers/payment.controller";
import isAuth from "../middleware/is-auth";
import isAdmin from "../middleware/is-admin";

const router: Router = express.Router();

router.post('/create', isAuth, isAdmin, paymentController.createPayment);


export {router as paymentRouter};