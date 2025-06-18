import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/not-authorized-error';
// import CustomError from '../model/error';

interface UserPayload {
    userId: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export default async (req : Request, res : Response, next: NextFunction) => {
    try {
        let token = "";
        if(!req.get('Authorization')){
            throw new NotAuthorizedError();
        }
        token = req.get('Authorization')!.split(' ')[1];
        const data : any = jwt.verify(token, 'areallylongstringaskey');         
        if(!data) {
            throw new NotAuthorizedError();
        }

        req.currentUser = data;
        next()
    } catch(err : any) {
        err = new NotAuthorizedError();
        next(err)
    }
}

