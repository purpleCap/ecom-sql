import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User, UserModel } from "../util/database/model/user";
import { Cart } from "../util/database/model/cart";
import { CartProduct } from "../util/database/model/cart-product";
import { NotFoundError } from "../errors/not-found-error";
import { Order } from "../util/database/model/order";

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const addressId = req.body.addressId;
        const paymentId = req.body.paymentId;

        if(!addressId || !paymentId) {
            throw new BadRequestError("Need to provide addressId and paymentId");
        }

        const userObj: any = await User.findByPk(userId, {
            include: [{
                model: Cart,
                as: 'cart'
              }],
        });

        if(!userObj) {
            throw new NotFoundError("User not found")
        }

        let cart = userObj!.cart;
        const cartId = cart.dataValues.cartId;
        const cartData = await CartProduct.findAll({
            where: {
                cartId,
            },
            include: [Product],
            
        });
        
        let sum = cartData.reduce((acc, curr) =>
            acc + (curr.toJSON().quantity) * curr!.toJSON()!.product!.price,
        0);
        


        const order = await Order.create({ addressId, paymentId, createdBy: userId, cartTotal: sum, subTotal: sum  });

        await CartProduct.destroy({
            where: {
                cartId
            }
        })

        res.status(200).json(new SuccessResponse({message: "Order placed", data: order }))
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const orderController = { placeOrder };
export default orderController;