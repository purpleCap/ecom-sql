import { NextFunction, Request, Response } from "express"
import { NotAuthorizedError } from "../errors/not-authorized-error"

export default async (req : Request, res : Response, next: NextFunction) => {
    try {
        if(req.currentUser?.role !== 'admin') {
            throw new NotAuthorizedError();
        }
        next()
    } catch(err : any) {
        next(err)
    }
}