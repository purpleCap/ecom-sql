import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Cart } from "../util/database/model/cart";
import { CartProduct } from "../util/database/model/cart-product";

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prodId = req.body.productId;
        const userId = req.currentUser?.userId;
        const userObj: any = await User.findByPk(userId, {
            include: [{
                model: Cart,
                as: 'cart' // Use the same alias in the include statement
              }],
        });
        console.log(userObj);
        let cart = userObj.cart;
        if(!cart) {
            cart = await userObj.createCart();
        }

        const fetchedProducts = await cart.getProducts({where: { productId: prodId}});
        let qty = 1;
        let product;
        // console.log(fetchedProducts[0].CartProduct.dataValues.quantity);
        if(fetchedProducts.length > 0) {
            product = fetchedProducts[0];
            console.log(product.cartProduct.dataValues.quantity + 1);
            qty = product.cartProduct.dataValues.quantity + 1
        } else {
            product = await Product.findByPk(prodId);
        }
        if(!product) {
            throw new BadRequestError("Unable to find product");
        }
        await cart.addProduct(product, { through: { quantity: qty } })

        res.status(200).json(new SuccessResponse({message: qty==1 ? "Product added" : "Product quantity updated", data: cart}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prodId = req.body.productId;
        const userId = req.currentUser?.userId;
        const userObj: any = await User.findByPk(userId, {
            include: [{
                model: Cart,
                as: 'cart' // Use the same alias in the include statement
              }],
        });
        // console.log(userObj);
        let cart = userObj.cart;
        if(!cart) {
            throw new BadRequestError("No cart found!")
        }


        await CartProduct.destroy({
            where: {
                productId: prodId,
                cartId: cart.dataValues.cartId
            }
        });

        res.status(200).json(new SuccessResponse({message: "Product removed"}))
    } catch(err) {
        next(err);
    }
}

const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prodId = req.body.productId;
        const action = req.body.action;
        const userId = req.currentUser?.userId;
        const userObj: any = await User.findByPk(userId, {
            include: [{
                model: Cart,
                as: 'cart'
              }],
        });

        let cart = userObj.cart;
        if(!cart) {
            throw new BadRequestError("No cart found!")
        }


        const item = await CartProduct.findOne({
            where: {
                productId: prodId,
                cartId: cart.dataValues.cartId
            }
        });

        if(!item) {
            throw new BadRequestError("Product not found");
        }

        if(action !== "+" && item.quantity === 1) {
            throw new BadRequestError("Minimum order quantity must be one");
        }
        item.quantity = action === '+' ? item.quantity + 1 : item.quantity - 1;

        await item.save();

        res.status(200).json(new SuccessResponse({message: "Product updated"}))
    } catch(err) {
        next(err);
    }
}

const cartController = { addToCart, removeItem, updateQuantity };
export default cartController;