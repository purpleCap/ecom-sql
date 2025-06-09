import express, { Router } from "express";
import { userRouter } from "./user.routes";
import { productRouter } from "./product.routes";
import { cartRouter } from "./cart.routes";
import { blogRouter } from "./blog.routes";
import { categoryRouter } from "./category.routes";
import { brandRouter } from "./brand.routes";
import { wishlistRouter } from "./wishlist.routes";
import { couponRouter } from "./coupon.routes";

const rootRouter: Router = express.Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/product', productRouter);
rootRouter.use('/cart', cartRouter);
rootRouter.use('/blog', blogRouter);
rootRouter.use('/category', categoryRouter);
rootRouter.use('/brand', brandRouter);
rootRouter.use('/wishlist', wishlistRouter);
rootRouter.use('/coupon', couponRouter);

export default rootRouter;