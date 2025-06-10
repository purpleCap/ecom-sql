import express, { Router } from "express";
import isAuth from "../middleware/is-auth";
import productController from "../controllers/product.controller";
import isAdmin from "../middleware/is-admin";
import { productImgResize, uploadPhoto } from "../middleware/upload-image";

const router: Router = express.Router();

router.get('/', productController.getAllProducts);
router.post('/', isAuth, productController.createProduct);
router.put('/upload/:id', isAuth, isAdmin, uploadPhoto.array("images", 10), productImgResize, productController.uploadImages);
router.get('/:id', productController.findProductById);
router.delete('/:id', isAuth, productController.deleteProductById);
router.post('/rating', isAuth, productController.rateProduct);


export {router as productRouter};