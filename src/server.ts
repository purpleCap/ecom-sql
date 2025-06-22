import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from "express";
import morgan from 'morgan';
import dbConnect from "./config/dbConnect";
import { CustomError } from "./errors/custom-errors";
import rootRouter from "./routes/index.routes";
import { PORT } from './secret';
import { Category } from "./util/database/model/category";
import { User } from "./util/database/model/user";
import tableAssociations from "./util/database/table-associations";
import { connectRedis } from './util/redis/redis-client';

const server = express();

server.use(cookieParser());
server.use(express.json());
server.use(morgan('dev'));

server.use('/api', rootRouter);


server.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    if (JSON.stringify(error) !== '{}') {
        res.status(error.statusCode || 500).json({ 
            status: false, 
            statusCode: error.statusCode || 500, 
            message: "Something Went Wrong", 
            errors: error?.serializeErrors ? error.serializeErrors() : error 
        });
    } else {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
});

tableAssociations();

dbConnect(() => server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    (async () => {
        await connectRedis();
    })();
    (async () => {
        try {
            if (!await User.findOne({ where: { email: 'demo@demo.com' }, attributes: ['email'] })) {
                await User.create({
                    firstname: "Test",
                    lastname: "User",
                    email: "demo@demo.com",
                    mobile: '8989778760',
                    password: "Pass@123"
                })
                await User.create({
                    firstname: "Admin",
                    lastname: "User",
                    email: "demoadmin@demo.com",
                    mobile: '9001221200',
                    password: "Pass@123",
                    role: 'admin'
                })
            }
            if ((await Category.findAll()).length == 0) {
                await Category.create({
                    title: 'Electronics'
                })
            }
        } catch (err) {
            console.log(err);
        }
    })()
}));


export default server;