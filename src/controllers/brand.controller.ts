import { Request, Response, NextFunction } from "express"
import { Brand } from "../util/database/model/brand";
import { SuccessResponse } from "../model/success";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";

const createBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const { title } = req.body;
        const brand = await Brand.create({ title });
        res.status(201).json(new SuccessResponse({ message: "New brand created ", statusCode: 201, data: brand }));
    } catch(err) {
        next(err);
    }
}

const updateBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const { brandId, title } = req.body;
        const fetchedBrand = await Brand.findByPk(brandId);
        if(!fetchedBrand) {
            throw new NotFoundError("Brand not found. Check the provided id");
        }
        fetchedBrand.title = title;
        await fetchedBrand.save();
        res.status(200).json(new SuccessResponse({ message: "Brand updated ", data: fetchedBrand }));
    } catch(err) {
        next(err);
    }
}

const deleteBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const brandId = req.params.id;
        const fetchedBrand = await Brand.findByPk(brandId);
        if(!fetchedBrand) {
            throw new NotFoundError("Brand not found. Check the provided id");
        }
        await fetchedBrand.destroy();
        res.status(200).json(new SuccessResponse({ message: "Brand deleted ", data: fetchedBrand }));
    } catch(err) {
        next(err);
    }
}

const getBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const brandId = req.params.id;
        const fetchedBrand = await Brand.findByPk(brandId);
        if(!fetchedBrand) {
            throw new NotFoundError("Brand not found. Check the provided id");
        }

        res.status(200).json(new SuccessResponse({ message: "Brand fetched", data: fetchedBrand }));
    } catch(err) {
        next(err);
    }
}

const getAllBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const fetchedBrand = await Brand.findAll();
        // if(fetchedBrand) {
        //     throw new NotFoundError("Brand not found. Check the provided id");
        // }
        const msg = fetchedBrand.length > 0 ? "Brands fetched" : "No Brand found";
        res.status(200).json(new SuccessResponse({ message: msg, data: fetchedBrand }));
    } catch(err) {
        next(err);
    }
}

const brandController = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand };
export default brandController;