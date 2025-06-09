import express, { Router } from "express";
import isAuth from "../middleware/is-auth";
import productController from "../controllers/product.controller";

const router: Router = express.Router();

router.get('/', productController.getAllProducts);
router.post('/', isAuth, productController.createProduct);
router.get('/:id', productController.findProductById);
router.delete('/:id', isAuth, productController.deleteProductById);


export {router as productRouter};