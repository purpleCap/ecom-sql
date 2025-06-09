import { Request, Response, NextFunction } from "express"
import { SuccessResponse } from "../model/success";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Coupon } from "../util/database/model/coupon";

const createCoupon = async (req: Request, res: Response, next: Function) => {
    try {
        const { title, discount, expiry } = req.body;
        const coupon = await Coupon.create({ title, discount, expiry });
        res.status(201).json(new SuccessResponse({ message: "New coupon created ", statusCode: 201, data: coupon }));
    } catch(err) {
        next(err);
    }
}

const updateCoupon = async (req: Request, res: Response, next: Function) => {
    try {
        const { couponId, title, discount, expiry } = req.body;
        const fetchedCoupon = await Coupon.findByPk(couponId);
        if(!fetchedCoupon) {
            throw new NotFoundError("Coupon not found. Check the provided id");
        }
        fetchedCoupon.title = title;
        fetchedCoupon.discount = discount;
        fetchedCoupon.expiry = expiry;
        await fetchedCoupon.save();
        res.status(200).json(new SuccessResponse({ message: "Coupon updated ", data: fetchedCoupon }));
    } catch(err) {
        next(err);
    }
}

const deleteCoupon = async (req: Request, res: Response, next: Function) => {
    try {
        const couponId = req.params.id;
        const fetchedCoupon = await Coupon.findByPk(couponId);
        if(!fetchedCoupon) {
            throw new NotFoundError("Coupon not found. Check the provided id");
        }
        await fetchedCoupon.destroy();
        res.status(200).json(new SuccessResponse({ message: "Coupon deleted ", data: fetchedCoupon }));
    } catch(err) {
        next(err);
    }
}

const getCoupon = async (req: Request, res: Response, next: Function) => {
    try {
        const couponId = req.params.id;
        const fetchedCoupon = await Coupon.findByPk(couponId);
        if(!fetchedCoupon) {
            throw new NotFoundError("Coupon not found. Check the provided id");
        }

        res.status(200).json(new SuccessResponse({ message: "Coupon fetched", data: fetchedCoupon }));
    } catch(err) {
        next(err);
    }
}

const getAllCoupons = async (req: Request, res: Response, next: Function) => {
    try {
        const fetchedCoupon = await Coupon.findAll();
        // if(fetchedCoupon) {
        //     throw new NotFoundError("Brand not found. Check the provided id");
        // }
        const msg = fetchedCoupon.length > 0 ? "Coupon fetched" : "No Coupon found";
        res.status(200).json(new SuccessResponse({ message: msg, data: fetchedCoupon }));
    } catch(err) {
        next(err);
    }
}

const couponController = { createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupons };
export default couponController;