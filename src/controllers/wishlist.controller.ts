import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Wishlist } from "../util/database/model/wishlist";

const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prodId = req.body.productId;
        const userId = req.currentUser?.userId;
        const userObj: any = await User.findByPk(userId, {
            include: [{
                model: Wishlist,
              }],
        });
        console.log(userObj);
        let wishlist = userObj.wishlist;
        if(!wishlist) {
            wishlist = await userObj.createWishlist();
        }

        const fetchedProducts = await wishlist.getProducts({where: { productId: prodId}});
        let isProdPresent = false;
        let product;
        // console.log(fetchedProducts[0].CartProduct.dataValues.quantity);
        if(fetchedProducts.length > 0) {
            isProdPresent = true;
            product = fetchedProducts[0];
        } else {
            product = await Product.findByPk(prodId);
        }
        if(!product) {
            throw new BadRequestError("Unable to find product");
        }
        if(!isProdPresent)
            await wishlist.addProduct(product)
        else
            await wishlist.removeProduct(product)

        res.status(200).json(new SuccessResponse({message: !isProdPresent ? "Product added to wishlist" : "Product removed from wishlist", data: wishlist}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const wishlistController = { addToWishlist };
export default wishlistController;