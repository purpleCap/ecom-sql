import { Request, Response, NextFunction } from "express"
import { SuccessResponse } from "../model/success";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Payment } from "../util/database/model/payment";
import slugifyPayment from "../helper/slugify-payment";

const createPayment = async (req: Request, res: Response, next: Function) => {
    try {
        const { name } = req.body;
        const paymentCode = slugifyPayment(name);
        const payment = await Payment.create({ name, paymentCode });
        res.status(201).json(new SuccessResponse({ message: "New payment method created ", statusCode: 201, data: payment }));
    } catch(err) {
        next(err);
    }
}

const updateBrand = async (req: Request, res: Response, next: Function) => {
    try {
        const { paymentId, name } = req.body;
        const fetchedPayment = await Payment.findByPk(paymentId);
        if(!fetchedPayment) {
            throw new NotFoundError("Payment not found. Check the provided paymentId");
        }
        fetchedPayment.name = name;
        await fetchedPayment.save();
        res.status(200).json(new SuccessResponse({ message: "Payment updated ", data: fetchedPayment }));
    } catch(err) {
        next(err);
    }
}

const deleteBrand = async (req: Request, res: Response, next: Function) => {
    try {
      
    } catch(err) {
        next(err);
    }
}

const getBrand = async (req: Request, res: Response, next: Function) => {
    try {
       
    } catch(err) {
        next(err);
    }
}

const getAllBrand = async (req: Request, res: Response, next: Function) => {
    try {
      
    } catch(err) {
        next(err);
    }
}

const paymentController = { createPayment, updateBrand, deleteBrand, getBrand, getAllBrand };
export default paymentController;