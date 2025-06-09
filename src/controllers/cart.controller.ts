import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Cart } from "../util/database/model/cart";

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
            console.log(product.CartProduct.dataValues.quantity + 1);
            qty = product.CartProduct.dataValues.quantity + 1
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

const findProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [User]
        });
        if(!product) {
            throw new BadRequestError("Product not found");
        }
        res.status(200).json(new SuccessResponse({ message: 'Product found', data: product}))
    } catch(err) {
        next(err);
    }
}

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        
        const user = await User.findByPk(userId);
        console.log(userId)
        if(!(userId && user)) {
            throw new BadRequestError("User not found")
        }
        const body = req.body;
        const prod = await Product.create({ title: body.title, slug: body.slug, price: body.price, description: body.description, brandId: body.brand, stockQuantity: 10, categoryId: body.categoryId, userId: userId });
        res.status(201).json(new SuccessResponse({ message: "Product created successfully", statusCode: 201, data: prod }));
    } catch(err) {
        next(err);
    }
}

const cartController = { addToCart };
export default cartController;