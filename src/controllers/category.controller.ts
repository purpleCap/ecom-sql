import { Request, Response, NextFunction } from "express"
import { Category } from "../util/database/model/category";
import { SuccessResponse } from "../model/success";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";

const createCategory = async (req: Request, res: Response, next: Function) => {
    try {
        const { title } = req.body;
        const catagory = await Category.create({ title });
        res.status(201).json(new SuccessResponse({ message: "New category created ", statusCode: 201, data: catagory }));
    } catch(err) {
        next(err);
    }
}

const updateCategory = async (req: Request, res: Response, next: Function) => {
    try {
        const { categoryId, title } = req.body;
        const fetchedCategory = await Category.findByPk(categoryId);
        if(!fetchedCategory) {
            throw new NotFoundError("Category not found. Check the provided id");
        }
        fetchedCategory.title = title;
        await fetchedCategory.save();
        res.status(200).json(new SuccessResponse({ message: "Category updated ", data: fetchedCategory }));
    } catch(err) {
        next(err);
    }
}

const deleteCategory = async (req: Request, res: Response, next: Function) => {
    try {
        const categoryId = req.params.id;
        const fetchedCategory = await Category.findByPk(categoryId);
        if(!fetchedCategory) {
            throw new NotFoundError("Category not found. Check the provided id");
        }
        await fetchedCategory.destroy()
        res.status(200).json(new SuccessResponse({ message: "Category deleted ", data: fetchedCategory }));
    } catch(err) {
        next(err);
    }
}

const getCategory = async (req: Request, res: Response, next: Function) => {
    try {
        const categoryId = req.params.id;
        const fetchedCategory = await Category.findByPk(categoryId);
        if(!fetchedCategory) {
            throw new NotFoundError("Category not found. Check the provided id");
        }

        res.status(200).json(new SuccessResponse({ message: "Category fetched", data: fetchedCategory }));
    } catch(err) {
        next(err);
    }
}

const getAllCategory = async (req: Request, res: Response, next: Function) => {
    try {
        const fetchedCategory = await Category.findAll();
        // if(fetchedCategory) {
        //     throw new NotFoundError("Category not found. Check the provided id");
        // }
        const msg = fetchedCategory.length > 0 ? "Categories fetched" : "No category found";
        res.status(200).json(new SuccessResponse({ message: msg, data: fetchedCategory }));
    } catch(err) {
        next(err);
    }
}

const categoryController = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory };
export default categoryController;