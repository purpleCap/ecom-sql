import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Op, where } from "sequelize";
import fs from 'fs';
import { ProductRating } from "../util/database/model/productRating";
import { cloudinaryUploadedImage } from "../util/cloudinary";
import { NotFoundError } from "../errors/not-found-error";

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
        if(product?.createdBy !== userId) {
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
        const prod = await Product.create({ title: body.title, slug: body.slug, price: body.price, description: body.description, brandId: body.brandId, stockQuantity: 10, categoryId: body.categoryId, createdBy: userId });
        res.status(201).json(new SuccessResponse({ message: "Product created successfully", statusCode: 201, data: prod }));
    } catch(err) {
        next(err);
    }
}

const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        // const files = req.files;
        console.log(req.files);
        
        const uploader = (path: string) => cloudinaryUploadedImage(path);
        const urls = [];
        const files: any = req.files;

        if(files?.length==0) {
            throw new BadRequestError("No images found")
        }

        for(const file of files) {
            const {path} = file;
            console.log("PATH",path)
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }

        const findProduct = await Product.findByPk(id);
        if(!findProduct) {
            throw new NotFoundError();
        }
        findProduct!.image = urls[0].url;

        await findProduct.save();
        res.status(201).json(new SuccessResponse({ message: "Image uploaded", statusCode: 201 }));
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const rateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const { rating, productId } = req.body;
        
        if (!userId || !productId || rating === undefined) {
            throw new BadRequestError("Missing required data");
        }

        const user = await User.findByPk(userId);
        // console.log(await user?.getProductRatings());
        if (!user) throw new BadRequestError("User not found");

        const product = await Product.findByPk(productId);
        if (!product) throw new BadRequestError("Product not found");

        // Check if user has already rated this product
        const ratedProduct = await ProductRating.findOne({
            where: { userId, productId }
        });
        // const {rows, count} = await ProductRating.findAndCountAll({
        //     where: { productId }
        // });

        if (ratedProduct) {
            // Update existing rating
            ratedProduct.itemRating = rating;
            await ratedProduct.save();
        } else {
            await ProductRating.create({ userId, productId, itemRating: rating })
        }
        res.status(201).json(new SuccessResponse({ message: "Rating submitted", statusCode: 201 }));
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const productController = { getAllProducts, createProduct, findProductById, deleteProductById, rateProduct, uploadImages };
export default productController;