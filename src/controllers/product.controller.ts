import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Op } from "sequelize";

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let limit = 2;
        let offset = 0;
        const { brandId, pricegt, categoryId, page } = req.query;


        const filterObj = {};
        if(brandId) {
            Object.assign(filterObj, { brandId })
        }

        if(categoryId) {
            Object.assign(filterObj, { categoryId })
        }

        if(pricegt) {
            Object.assign(filterObj, { price: {
                [Op.gte] : pricegt as string ?? 0
            } })
        }

        const searchObj = {
            where: filterObj,
            // include: ['brands', 'categorys']
        };

        if(page) {
            offset = (Number(page)-1)*limit;
            Object.assign(searchObj, { limit, offset});
        }

        const products = await Product.findAll(searchObj);
        res.status(200).json(new SuccessResponse({ message: 'All products', data: products}))
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

const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;

        const product = await Product.findByPk(req.params.id);
        if(product?.userId !== userId) {
            throw new BadRequestError("You are not allowed to delete this product");
        }

        await product?.destroy();
        
        res.status(200).json(new SuccessResponse({ message: 'Product deleted' }))
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
        const prod = await Product.create({ title: body.title, slug: body.slug, price: body.price, description: body.description, brandId: body.brandId, stockQuantity: 10, categoryId: body.categoryId, userId: userId });
        res.status(201).json(new SuccessResponse({ message: "Product created successfully", statusCode: 201, data: prod }));
    } catch(err) {
        next(err);
    }
}

const productController = { getAllProducts, createProduct, findProductById, deleteProductById };
export default productController;