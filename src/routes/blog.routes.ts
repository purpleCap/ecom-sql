import express, { Router } from "express";
import blogController from "../controllers/blog.controller";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.post('/create', isAuth, blogController.createBlog);
router.put('/update/:id', isAuth, blogController.updateBlog);
router.get('/:id', blogController.getBlog);
router.delete('/:id', isAuth, blogController.deleteBlog);
router.put('/like-dislike/:id', isAuth, blogController.likeDislikeBlog);


export {router as blogRouter};